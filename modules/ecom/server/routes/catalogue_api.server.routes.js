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
var cataloguePolicy = require('../policies/catalogue.server.policy');

module.exports = function(app) {
    var _middleware = function () { console.error('osprey not configured'); };
    
    var ramlMiddleware = function(req,res,next) {
        _middleware(req,res,function(err) {
            if (err) {
                console.warn(err);
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
    
    app.use('/api/10',express.Router().use(
        ramlMiddleware, cataloguePolicy.isAllowed, proxyMiddleware
    ));

    apis.catalogue.raml
        .then(function(raml) {
            _middleware = osprey.server(raml);
        })
        .catch(function(err) { console.error(err); });
};
