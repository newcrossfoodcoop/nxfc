'use strict';

// External Modules
var path = require('path');
var osprey = require('osprey');
var proxy = require('express-http-proxy');
var url = require('url');
var express = require('express');
var finalhandler = require('finalhandler');
var debug = require('debug')('ecom');

// Internal Modules
var config = require(path.resolve('./config/config'));
var apis = require(path.resolve('./config/lib/apis'));

// ACL Policies
var stockPolicy = require('../policies/stock.server.policy');

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
        config.stock.uri, {
            forwardPath: function(req, res) {
                return config.stock.path + url.parse(req.url).path;
            }
        }
    );
    
    // .post('*',populatePostUser)
    var populatePostUser = function(req,res,next) {
        if (req.user) {
            req.body.user = req.user._id.toString();
        }
        next();
    };
    
    app.use('/api/40', express.Router()
        .use(ramlMiddleware, stockPolicy.isAllowed, proxyMiddleware)
    );

    apis.stock.raml
        .then(function(raml) { _middleware = osprey.server(raml); })
        .catch(function(err) { console.error(err); });
};
