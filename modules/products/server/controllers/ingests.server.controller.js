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
	async = require('async');

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
    if (!ingest.fieldMap) { return callback(null, context); }
    
    context.ingestLog.log('configuring csv parser');
    
    var fieldMap = yaml.load(ingest.fieldMap);
    var parser = csv.parse({delimiter: ',', trim: true, columns: true, relax: true});
                
    parser.on('readable', function(){
        var record;
        
        async.whilst(
            function(){
                record = parser.read();
                return !!(record); 
            },
            function(callback) {
                Product.findOne(
                    {supplierCode: record[fieldMap.supplierCode]}, 
                    function(_err, product) {
                        if (_err) { callback(_err); }
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
                        
                        product.save(callback);
                    }
                );
            },
            function(err) {
                if (err) {
                    console.log('error', err);
                }
            }
        );

    });
    
    parser.on('error', function(_err){
        // record ingest status
        context.ingestLog.log('csv parser error: %s', _err);
    });
    
    parser.on('finish', function(){
        // record ingest status
        context.ingestLog.log('csv parsing complete %s records processed', this.count);
    });
    
    context.parser = parser;
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
    var ingestLog = new IngestLog({ ingest: ingest._id });
    
    function startLog(callback) {
        ingestLog.log('create log');
        ingestLog.save(function(err) {
            if (err) {
                res.status(500).jsonp({
                    status: 'failed to save log'
                });
                callback(err); 
            } else {
                res.jsonp({
                    ingestLog: ingestLog._id,
                    status: 'accepted'
                });
                callback(null, {ingest: ingest, ingestLog: ingestLog});
            }
        });
    }
    
    async.waterfall([
        startLog,
        securityFormPost,
        csvParser,
        streamAndParse
    ], function (err) {
        ingestLog.finish(err);
        ingestLog.save(function(err) {
            if (err) {
                ingestLog.log('failed to save log :(');
            }
        });
    });
};
