'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Ingest = mongoose.model('Ingest'),
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

exports.run = function(req, res, next) {
    var ingest = req.ingest;
    if (ingest.securityType) {
        if (ingest.securityType === 'formPost') {
            var payload = yaml.load(ingest.formPostPayload);
            var fieldMap = yaml.load(ingest.fieldMap);
            
            var j = request.jar();
            var rq = request.defaults({jar:j});
            rq.post(ingest.formPostUrl,{ form: payload }, function(err,httpResponse,body){
                if (err) { return next(err); }
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
                                    
                                    console.log('values', values);
                                    
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
                });
                
                parser.on('finish', function(){
                    // record ingest status
                });
                
                rq.get(ingest.downloadUrl).pipe(parser);
                
            });
        }
    }
    res.jsonp({status: 'accepted'});
};
