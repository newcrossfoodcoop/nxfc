'use strict';

// External Modules
var path = require('path');
var osprey = require('osprey');
var proxy = require('express-http-proxy');
var url = require('url');
var express = require('express');
var finalhandler = require('finalhandler');
var debug = require('debug')('ecom');
var _ = require('lodash');

// Internal Modules
var config = require(path.resolve('./config/config'));
var apis = require(path.resolve('./config/lib/apis'));

// ACL Policies
var checkoutPolicy = require('../policies/checkout.server.policy');
var ordersPolicy = require('../policies/orders.server.policy');

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
        config.checkout.uri, {
            forwardPath: function(req, res) {
                return config.checkout.path + url.parse(req.url).path;
            }
        }
    );
    
    var populatePostUser = function(req,res,next) {
        if (req.user) {
            req.body.user = _.pick(req.user, [
                '_id', 'username', 'displayName', 'email'
            ]);
            req.body.user._id = req.body.user._id.toString();
        }
        next();
    };
    
    app.use('/api/checkout',
        express.Router()
            .post('*',populatePostUser)
            .use(resplitUrl(1),ramlMiddleware, checkoutPolicy.isAllowed, proxyMiddleware)
    );
    
    app.use('/api/orders',express.Router()
        // Extra order history check
        .get('/history/:orderUserId', (req,res,next) => { next(); })
        .param('orderUserId', function(req,res,next,id) {
            if (req.user.id === id) { return next(); }
            next(new Error('Logged in user history only'));
        })
        .use(resplitUrl(1),ramlMiddleware, ordersPolicy.isAllowed, proxyMiddleware)
    );

    apis.checkout.raml
        .then(function(raml) {
            _middleware = osprey.server(raml);
        })
        .catch(function(err) { console.error(err); });
};
