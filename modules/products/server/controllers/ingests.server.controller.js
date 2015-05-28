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
    $ = require('jquery')(jsdom.jsdom().parentWindow),
    Corq = require('corq'),
    queue = new Corq();

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

/**
 * Create a ingest
 */
exports.create = function(req, res) {
	var ingest = new Ingest(req.body);
	ingest.user = req.user;

	ingest.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ingest);
		}
	});
};

/**
 * Show the current ingest
 */
exports.read = function(req, res) {
	res.jsonp(req.ingest);
};

/**
 * Update a ingest
 */
exports.update = function(req, res) {
	var ingest = req.ingest ;

	ingest = _.extend(ingest , req.body);

	ingest.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ingest);
		}
	});
};

/**
 * Delete an ingest
 */
exports.delete = function(req, res) {
	var ingest = req.ingest ;

	ingest.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ingest);
		}
	});
};

/**
 * List of ingests
 */
exports.list = function(req, res) { 
    Ingest.find().sort('-created').populate('user', 'displayName').exec(function(err, ingests) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ingests);
		}
	});
};

/**
 * ingest middleware
 */
exports.ingestByID = function(req, res, next, id) { 
    Ingest.findById(id)
        .populate('user', 'displayName')
        .populate('supplier', 'name')
        .exec(function(err, ingest) {
		    if (err) return next(err);
		    if (! ingest) return next(new Error('Failed to load ingest ' + id));
		    req.ingest = ingest ;
		    next();
	    });
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
                    'record', 
                    { record: record, context: context }
                );
                context.count++;
            }
            record = parser.read();
        } while (!!(record) && (context.limit && context.limit > context.count));
        
    });
    
    parser.on('error', function(_err){
        // record ingest status
        context.ingestLog.log('csv parser error: %s', _err);
    });
    
    parser.on('finish', function(){
        // record ingest status
        context.totalrecords = this.count;
        context.ingestLog.log('csv parsing complete %s records processed', this.count);
    });
    
    context.parser = parser;
    callback(null,context);
}

function _runSelectors(item, selectors, html) {
    var product = item.product;
    _(selectors)
        .keys()
        .forEach(function(k) {
            if (k.match(/imageurl$/i)) {
                product[k] = $(html).find(selectors[k]).attr('src');
            } else if (k.match(/url$/i)) {
                product[k] = $(html).find(selectors[k]).attr('href');
            } else {
                product[k] = $(html).find(selectors[k]).text();
            }
        });
}

function searchAndScrapeExternal(item, callback) {
    var product = item.product;
    var ingest = item.context.ingest;
    
    if (!ingest.searchUrlTemplate) { return callback(null, item); }
    
    var swigOpts = {
        locals: {
            supplierCode: product.supplierCode
        }
    };

    async.waterfall([
        function(_callback) {
            request.get(
                swig.render(ingest.searchUrlTemplate, swigOpts),
                function(err,res,body) {
                    if (err) { return _callback(err); }
                    _runSelectors(item, item.context.searchSelectors, body);
                    _callback(null, product.externalUrl);
                }
            );
        },
        function(link,_callback) {
            if (!link) { _callback('product not found'); }
            request.get(
                link, 
                function(err,res,body) {
                    if (err) { return _callback(err); }
                    _runSelectors(item, item.context.productSelectors, body);
                    _callback();  
                }
            );
        }
    ], function(err) {
        if (err) { item.context.ingestLog.log('searchAndScrape error: %s',err); }
        callback(null, item);
    });
}

function extendProduct(item, callback) {
    var product = item.product;
    var record = item.record;
    var fieldMap = item.context.fieldMap;
    var ingest = item.context.ingest;
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
        product = new Product(values);
    }
    
    if (! product.supplier) {
        product.supplier = ingest.supplier._id;
    }
    
    callback(null,item);
}

function queueHandlers(context, callback) {
    
    context.queue.on('record', function(item, success, fail) {
        // There are no more records
        if (item.done) {
            context.ingestLog.log(
                '%s records of %s processed, failed records may still be re-tried', 
                context.processed, context.totalrecords
            );
            context.ingestLog.finish();
            return success();
        }
        
        if (context.processed % 100 === 0) {
            var complete = context.processed * 100 / context.totalrecords;
            context.ingestLog.log(
                '%s of %s (%s %)', context.processed, context.totalrecords, complete.toFixed(2)
            );
        }
        
        Product.findOne(
            {supplierCode: item.record[item.context.fieldMap.supplierCode]}, 
            function(err, product) {
                if (err) { fail(err); }
            
                item.product = product;
                
                async.waterfall([
                    function(cb) { cb(null,item); },
                    extendProduct,
                    searchAndScrapeExternal
                ], function(err) {
                    if (err) { context.ingestLog.log('queue item error: %s', err); }
                    product.save(function(err) {
                        if (err) { return fail(err); }
                        context.processed++;
                        return success();
                    });
                }); 
            }
        );
    });
    
    callback(null,context);
}

function streamAndParse(context, callback) {
    var ingest = context.ingest;
    if (!ingest.downloadUrl) { callback(null,context); }
    
    context.ingestLog.log('stream file and parse it');
    
    context.request.get(ingest.downloadUrl)
        .pipe(context.parser)
        .on('finish',callback)
        .on('error',callback);
}

exports.run = function(req, res, next) {
    var ingest = req.ingest;
    var ingestLog = new IngestLog({ ingest: ingest._id, status: 'running' });
    
    var fieldMap = yaml.load(ingest.fieldMap);
    var searchSelectors = yaml.load(ingest.searchSelectors);
    var productSelectors = yaml.load(ingest.productSelectors);
    
    var context = {
        ingest: ingest, 
        ingestLog: ingestLog,
        fieldMap: fieldMap,
        searchSelectors: searchSelectors,
        productSelectors: productSelectors,
        queue: queue,
        limit: req.query.limit,
        count: 0,
        totalitems: 0
    };
    
    function startLog(callback) {
        
        ingestLog.save(function(err) {
            if (err) {
                res.status(500).jsonp({
                    status: 'failed to create log'
                });
                callback(err); 
            } else {
                ingestLog.log('starting to log...');
                res.jsonp({
                    ingestLog: ingestLog._id,
                    status: 'accepted'
                });
                callback(null, context);
            }
        });
    }
    
    async.waterfall([
        startLog,
        securityFormPost,
        csvParser,
        queueHandlers,
        streamAndParse
    ], function (err) {
        if (err) { ingestLog.log('file parse ended with error: %s', err); }
        else { ingestLog.log('file parse complete'); }
        context.queue.push('record', {done: 'all done'});
    });
};
