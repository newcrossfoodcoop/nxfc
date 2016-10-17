'use strict';

// External Modules
var path = require('path');
var osprey = require('osprey');
var proxy = require('express-http-proxy');
var url = require('url');
var express = require('express');
var finalhandler = require('finalhandler');
var helmet = require('helmet');

// Internal Modules
var config = require(path.resolve('./config/config'));
var apis = require(path.resolve('./config/lib/apis'));

// ACL Policies
var ghostPolicy = require('../policies/ghost.server.policy');

function resplitUrl (baseParts) {
    baseParts++;
    return function (req,res,next) {
        var originalUrl = req.originalUrl.split('/');
        req.baseUrl = originalUrl.slice(0,baseParts).join('/');
        req.url = '/' + originalUrl.slice(baseParts).join('/');
        next();
    };
}

function ghostLogin(req,res,next) {
    var user = req.user.toObject();
    user.id = user._id;
    apis.ghost.api.resources.api.ghost.login
        .post(user)
        .then(function(_res) {
            res.status(_res.status);
            res.jsonp(_res.body);
        })
        .catch(next);
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
    
    var apiProxyMiddleware = proxy(config.ghost.uri);
    
    var router = express.Router()
        .use(resplitUrl(0))
        .get('/api/ghost/login', ghostPolicy.isAllowed, ghostLogin)
        .use(ramlMiddleware, ghostPolicy.isAllowed, apiProxyMiddleware);
    
    app.use('/api/ghost', router);
    
    var cmsProxyMiddleware = proxy(config.ghost.uri, {
        forwardPath: function(req, res) {
            return '/cms' + url.parse(req.url).path;
        }
    });
    
    app.use(
        '/cms',
        helmet.xframe('sameorigin'),
        ghostPolicy.isAllowed,
        cmsProxyMiddleware
    );

    apis.ghost.raml
        .then(function(raml) {
            _middleware = osprey.server(raml);
        })
        .catch(function(err) { console.error(err); });
};
