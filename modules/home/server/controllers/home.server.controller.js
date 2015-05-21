'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    crypto = require('crypto'),
	User = mongoose.model('User');

exports.renderHoldingPage = function(req, res, next) {
    var cookie = req.cookies.holding;
    if(cookie){
        return next();
    } else {
        res.cookie('holding','yes', { maxAge: 900000, httpOnly: false});
        res.render('modules/home/server/views/holding');
    }
};

exports.checkBasicAuth = function(req, res, next) {
    var auth;
    var config = req.app.locals.home;

    // check whether an autorization header was sent
    if (req.headers.authorization) {
        // only accepting basic auth, so:
        // * cut the starting "Basic " from the header
        // * decode the base64 encoded username:password
        // * split the string at the colon
        // -> should result in an array
        auth = new Buffer(req.headers.authorization.substring(6), 'base64').toString().split(':');
    }
    
    // checks if:
    // * auth array exists
    // * first value matches the expected user
    // * second value the expected password
    function returnUnAuthorized(res) {
        if (req.path === '/register-interest' && req.body.email) {
            registerInterest(req, function(err) {
                res.statusCode = err ? 400 : 200;
                res.render('modules/home/server/views/holding', {
                    errors: err ? _(err.errors).values().pluck('message').value() : undefined,
                    message: 'Thanks ' + req.body.firstName + ', we\'ll be in touch!'
                });
            });
        } else {
            // any of the tests failed
            // send an Basic Auth request (HTTP Code: 401 Unauthorized)
            res.statusCode = 401;
            // MyRealmName can be changed to anything, will be prompted to the user
            res.setHeader('WWW-Authenticate', 'Basic realm="Holding"');
            // this will be displayed in the browser when authorization is cancelled
            res.render('modules/home/server/views/holding');
        }
    }
    
    function registerInterest(req, callback) {
	    crypto.randomBytes(20, function(err, buffer) {
		    var token = buffer.toString('hex');
            var user = new User({
                email: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                displayName: req.body.firstName + ' ' + req.body.lastName,
                state: 'interested',
                provider: 'local',
                username: token,
                password: token
            });
            user.save(callback);
	    });
    }

    if (!auth) {
        // no auth header
        returnUnAuthorized(res);
    } else if (auth[0] !== config.holdingUsername) {
        // username mismatch
        returnUnAuthorized(res);
    } else if (auth[1] !== config.holdingPassword) {
        // password mismatch
        returnUnAuthorized(res);
    } else {
        // continue with processing, user was authenticated
        next();
    }
};
