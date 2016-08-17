'use strict';

var async = require('async'),
    jsdom = require('jsdom'),
    jquery = require('jquery'),
    swig = require('swig'),
    request = require('request'),
    _ = require('lodash');

function _runSelectors(opts, selectors, html) {
    var product = opts.product;

	// This is the only place we use the modules and they don't release memory
	// http://stackoverflow.com/questions/13893163/jsdom-and-node-js-leaking-memory
	// This is essentially a worker function so we don't care about speed really
    var jd = jsdom.jsdom();
    var $ = jquery(jd.parentWindow);
    
    _(selectors)
        .keys()
        .forEach(function(k) {
            if (k.match(/imageurl$/i)) {
                product[k] = $(html).find(selectors[k]).attr('src');
            } else if (k.match(/url$/i)) {
                product[k] = $(html).find(selectors[k]).attr('href');
            } else {
                product[k] = $(html).find(selectors[k]).html();
            }
            //console.log('%s = "%s"',k,product[k]);
        });
    jd.parentWindow.close();
}

function searchAndScrapeExternal(opts, callback) {
    var product = opts.product = opts.product || {};
    
    if (!opts.searchUrlTemplate) { return callback('searchUrlTemplate not defined', opts); }
    
    var swigOpts = {
        locals: {
            supplierCode: product.supplierCode
        }
    };
    
    async.waterfall([
        function(_callback) {
            if (product.externalUrl) { return _callback(null, product.externalUrl); }
            request.get(
                swig.render(opts.searchUrlTemplate, swigOpts),
                function(err,res,body) {
                    if (err) { return _callback(err); }
                    _runSelectors(opts, opts.searchSelectors, body);
                    _callback(null, product.externalUrl);
                }
            );
        },
        function(link,_callback) {
            if (!link) { return _callback('product not found'); }
            request.get(
                link, 
                function(err,res,body) {
                    if (err) { return _callback(err); }
                    _runSelectors(opts, opts.productSelectors, body);
                    _callback();  
                }
            );
        }
    ], function(err) {
        var result = null;
        if (err) { result = 'searchAndScrape error:' + err; }
        callback(result, opts);
    });
}

//opts
//{
//    searchSelectors: Object,
//    productSelectors: Object,
//    product: Object,
//    searchUrlTemplate: String
//}

process.on('message',function(msg){
    searchAndScrapeExternal(msg, function(err, opts) {
        if (err) { console.log(err); }
        process.send({
            error: err,
            result: opts.product,
        });
        if (process.memoryUsage().heapUsed > 100e6) {
            console.log('child exiting:', process.memoryUsage());
            process.exit(0);
        }
    });
});
