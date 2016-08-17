'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Ingest = mongoose.model('Ingest'),
    IngestLog = mongoose.model('IngestLog'),
    Product = mongoose.model('Product'),
    request = require('request'),
    yaml = require('yaml-js'),
    fs = require('fs'),
    csv = require('csv'),
    _ = require('lodash'),
    async = require('async'),
    swig = require('swig'),
    jsdom = require('jsdom'),
    jquery = require('jquery'),
    childProcess = require('child_process'),
    path = require('path');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'ingest already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};


function securityFormPost(context,callback) {
    var ingest = context.ingest;
    if (ingest.securityType !== 'formPost') { return callback(null, context); }
    
    context.ingestLog.log('authenticating');
    
    var payload = yaml.load(ingest.formPostPayload);
    var j = request.jar();
    context.request = request.defaults({jar:j});
    context.request.post(
        ingest.formPostUrl,
        { form: payload }, 
        function(err,httpResponse,body){
            callback(err, context);
        }
    );
}

function csvParser(context, callback) {
    var ingest = context.ingest;
    var fieldMap = context.fieldMap;
    
    if (!ingest.fieldMap) { return callback(null, context); }
    
    context.ingestLog.log('configuring csv parser');
    
    var parser = csv.parse({delimiter: ',', trim: true, columns: true, relax: true});
                
    parser.on('readable', function(){
        var record;
        
        do {
            if (record) {
                context.queue.push( 
                    { record: record },
                    _.noop
                );
                context.count++;
            }
            record = parser.read();
        } while (record && ((context.limit && context.limit > context.count) || !context.limit));
        
    });
    
    parser.on('error', function(_err){
        // record ingest status
        context.ingestLog.log('csv parser error: %s', _err);
    });
    
    parser.on('finish', function(){
        // record ingest status
        context.totalrecords = this.count;
        context.ingestLog.log('csv parsing complete %s records processed', this.count);
        
        // we don't need this any more and it creates leaks by holding bags of references
        context.parser = null;
    });
    
    context.parser = parser;
    callback(null,context);
}

function extendProduct(item, context, callback) {
    var product = item.product;
    var record = item.record;
    var fieldMap = context.fieldMap;
    var ingest = context.ingest;
    var values = {};
    
    _(fieldMap)
        .keys()
        .forEach(function(k) {
            if (k === 'tags') {
                if (product) {
                    values[k] = _.union(product.tags, [record[fieldMap[k]]]);
                } else {
                    values[k] = [record[fieldMap[k]]];
                }
            }
            else {
                values[k] = record[fieldMap[k]];
            }
        });
    
    if (product) {
        product = _.extend(product, values);
    }
    else {
        item.product = product = new Product(values);
    }
    
    if (! product.supplier) {
        product.supplier = ingest.supplier._id;
    }
    
    //console.log('extendProduct', item.product._id);
    
    callback(null,item,context);
}

function closeTask(context) {
    if (context.fork) {
        context.fork.kill();
        context.fork = null;
    }
}

function searchAndScrapeExternal(item, context, callback) {

    if (!context.fork) {
        context.fork = childProcess.fork(path.resolve('./modules/ecom/worker/tasks/scrape.worker.task'));
        context.fork.on('exit', function() {
            if (context.currentMessage && context.currentMessage.tries) {
                var _cb = context.currentMessageCallback;
                var _cm = context.currentMessage;
                
                context.currentMessageCallback = null;
                context.currentMessage = null;
                return _cb('respawned already');
            }
            
            context.ingestLog.log('respawning child process');
            context.fork = null;
            setTimeout(function() {
                if (context.currentMessage) {
                    context.currentMessage.tries++;
                    searchAndScrapeExternal(context.currentItem, context, callback);
                }
            },2000);
        });
        context.fork.on('message', function(msg) {
            var _cb = context.currentMessageCallback;
            var _cm = context.currentMessage;
            var item = context.currentItem;
            
            //console.log('message received', msg.result._id);
            
            if (_cm.product._id.toString() !== msg.result._id.toString()) {
                context.ingestLog.log('result mismatch (ignoring):',_cm.product._id,msg.result._id);  
            } 
            else {
                context.currentMessageCallback = null;
                context.currentMessage = null;
                context.currentItem = null;
            
                if (item.product._id.toString() !== msg.result._id.toString()) {
                    _cb(['item mismatch:',item.product._id,msg.result._id].join(' '));
                }
                else if (msg.error) {
                    _cb(['message error', msg.error].join());
                } else {
                    _.extend(item.product, msg.result);
                    _cb(null,item,context);
                }
            }

        });
    }
    
    //console.log('searchAndScrape', item.product._id);
    
    if (context.currentMessage) {
        context.ingestLog.log('message still in flight, resending...');
    }
    else {
        context.currentMessage = {
            searchSelectors: context.searchSelectors,
            productSelectors: context.productSelectors,
            product: item.product.toObject(),
            searchUrlTemplate: context.ingest.searchUrlTemplate
        };
        context.currentMessageCallback = callback;
        context.currentItem = item;
    }
    
    context.fork.send(context.currentMessage);
}

function queueFunction(_context) {
    
    return function(item, _callback) {
        var context = _context;
        var called = 0;
        var callback = function(err) { 
            if (called++ > 0) {console.trace('called:', called);}
            _callback(err);
        };
    
        // There are no more records
        if (item.done) {
            context.ingestLog.log(
                '%s records of %s processed, failed records may still be re-tried', 
                context.processed, context.totalrecords
            );
            closeTask(context);
            context.ingestLog.finish(item.error);
            return callback();
        }
        
        if (context.processed > 0 && context.processed % 10 === 0) {
            var complete = context.processed * 100 / context.totalrecords;
            context.ingestLog.log(
                '%s of %s (%s %) { %s }', context.processed, context.totalrecords, complete.toFixed(2), 
                _(process.memoryUsage())
                    .mapValues(function(n) { return parseInt(n / 1e6) + 'M'; })
                    .pairs()
                    .map(function(p) {return p.join(': ');})
                    .join(', ')
            );
        }
        
        Product.findOne(
            {supplierCode: item.record[context.fieldMap.supplierCode]}, 
            function(err, product) {
                if (err) { return callback(err); }
                
                //console.log('product retrieved:', product._id);
                
                item.product = product;
                
                async.waterfall([
                    function(cb) { cb(null,item,context); },
                    extendProduct,
                    searchAndScrapeExternal
                ], function(err) {
                    if (err) { context.ingestLog.log('queue item error: %s', err); }
                    item.product.save(function(err) {
                        if (err) { return callback(err); }
                        context.processed++;
                        return callback();
                    });
                }); 
            }
        );
    };
}

function streamAndParse(context, callback) {
    var ingest = context.ingest;
    if (!ingest.downloadUrl) { callback(null,context); }
    
    context.ingestLog.log('stream file and parse it');
    
    context.request.get(ingest.downloadUrl)
        .pipe(context.parser)
        .on('finish',_.partial(callback,null,context))
        .on('error',_.partial(callback,_,context));
}

function startLog(context, callback) {
    
    var ingestLog = new IngestLog({ ingest: context.ingest._id, status: 'running' });
    context.ingestLog = ingestLog;
    
    context.ingestLog.save(function(err) {
        if (err) {
            callback(err); 
        } else {
            ingestLog.log('starting to log...');
            callback(null, context);
        }
        
        context.callback(err, {
            ingestLogId: ingestLog._id,
            status: 'accepted'
        });
        
        context.callback = null;
    });
}

function findIngestById(args,callback) {
    Ingest.findById(args.ingestId)
        .populate('user', 'displayName')
        .populate('supplier', 'name')
        .exec(function(err, ingest) {
	        if (err) return callback(err);
	        if (! ingest) return callback(new Error('Failed to load ingest ' + args.ingestId));

            var fieldMap = yaml.load(ingest.fieldMap);
            var searchSelectors = yaml.load(ingest.searchSelectors);
            var productSelectors = yaml.load(ingest.productSelectors);
            
            var context = {
                ingest: ingest, 
                fieldMap: fieldMap,
                searchSelectors: searchSelectors,
                productSelectors: productSelectors,
                limit: args.limit,
                count: 0,
                totalitems: 0,
                processed: 0,
                callback: args.callback
            };
            
            _.extend(args.context, context);
	        
	        callback(null,args.context);
        });
}

module.exports = function() {

    this.add({role: 'ingest', cmd: 'run'}, function(args, _callback) {
        args.callback = _callback;
        var context = args.context = {};
        var queue = async.queue(queueFunction(context),1);
        context.queue = queue;
        
        async.waterfall([
            _.partial(findIngestById, args),
            startLog,
            securityFormPost,
            csvParser,
            streamAndParse
        ], function (err) {
            var result = { done: 'done' };
            if (err) { 
                result.error = 'file parse ended with error: ' + err; 
            }
            queue.push(result, _.noop);
        });
    });

};
