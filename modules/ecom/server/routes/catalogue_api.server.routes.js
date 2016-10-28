'use strict';

// External Modules
var path = require('path');
var osprey = require('osprey');
var proxy = require('express-http-proxy');
var url = require('url');
var express = require('express');
var finalhandler = require('finalhandler');

// Internal Modules
var config = require(path.resolve('./config/config'));
var apis = require(path.resolve('./config/lib/apis'));

// ACL Policies
var productsPolicy = require('../policies/products.server.policy');
var suppliersPolicy = require('../policies/suppliers.server.policy');
var ingestsPolicy = require('../policies/ingests.server.policy');

function resplitUrl (baseParts) {
    baseParts++;
    return function (req,res,next) {
        var originalUrl = req.originalUrl.split('/');
        req.baseUrl = originalUrl.slice(0,baseParts).join('/');
        req.url = '/' + originalUrl.slice(baseParts).join('/');
        next();
    };
}

module.exports = function(app) {
    var _middleware = function () { console.error('osprey not configured'); };
    
    var ramlMiddleware = function(req,res,next) {
        _middleware(req,res,function(err) {
            if (err) {
                var done = finalhandler(req,res);
                done(err);
            }
            else {
                next();
            }
        });
    };
    
    var proxyMiddleware = proxy(
        config.catalogue.uri, {
            forwardPath: function(req, res) {
                return config.catalogue.path + url.parse(req.url).path;
            }
        }
    );
    
    app.use('/api/products',express.Router().use(
        resplitUrl(1),ramlMiddleware, productsPolicy.isAllowed, proxyMiddleware
    ));
    
    app.use('/api/suppliers',express.Router().use(
        resplitUrl(1),ramlMiddleware, suppliersPolicy.isAllowed, proxyMiddleware
    ));
    
    app.use('/api/ingests',express.Router().use(
        resplitUrl(1),ramlMiddleware, ingestsPolicy.isAllowed, proxyMiddleware
    ));

    apis.catalogue.raml
        .then(function(raml) {
            _middleware = osprey.server(raml);
        })
        .catch(function(err) { console.error(err); });
};
