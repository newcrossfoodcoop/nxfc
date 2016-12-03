'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
 	config = require(path.resolve('./config/config')),
	nodemailer = require('nodemailer');

var mongoose = require('mongoose'),
    _ = require('lodash'),
    crypto = require('crypto'),
	User = mongoose.model('User');

var util = require('util');
var thenify = require('thenify');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Username already exists';
				break;
			default:
				message = 'Something went wrong';
				console.error(err);
		}
	} else if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	} else {
	    console.error(err.stack);
	    message = 'Internal Error';
	}

	return message;
};

exports.renderHoldingPage = function(req, res, next) {
    var cookie = req.cookies.holding;
    if(cookie){
        return next();
    } else {
        res.cookie('holding','yes', { maxAge: 900000, httpOnly: false});
        res.render('modules/home/server/views/holding', {production: process.env.NODE_ENV === 'production'});
    }
};

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
            password: token,
            postcode: req.body.postcode
        });
        user.save(callback);
    });
}

exports.registerInterest = function(req, res) {
    registerInterest(req, (err,user) => {
        if (err) {
            console.error(err);
            res.status('400').send({ message: getErrorMessage(err) });
        }
        else {
            res.jsonp({ 'message': util.format(
                'Thanks %s! We have your details and will be in touch!', 
                user.firstName 
            ) });
        }
    });
};

exports.checkBasicAuth = function(req, res, next) {
    var auth;
    var config = req.app.locals.home;
    
    if (req.session.holdingAuthed) {
        return next();
    }

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
                    message: 'Thanks ' + req.body.firstName + ', we\'ll be in touch!',
                    production: process.env.NODE_ENV === 'production'
                });
            });
        } else {
            // any of the tests failed
            // send an Basic Auth request (HTTP Code: 401 Unauthorized)
            res.statusCode = 401;
            // MyRealmName can be changed to anything, will be prompted to the user
            res.setHeader('WWW-Authenticate', 'Basic realm="Holding"');
            // this will be displayed in the browser when authorization is cancelled
            res.render('modules/home/server/views/holding',{production: process.env.NODE_ENV === 'production'});
        }
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
        req.session.holdingAuthed = true;
        // continue with processing, user was authenticated
        next();
    }
};

/**
 * Send activation email (activate GET)
 */
exports.sendActivation = function(req, res, next) {
    
    var user = null;
	User.findOne({
		username: req.params.token,
		state: 'interested'
	}, '-salt -password')
	.then((_user) => {
	    user = _user;
	    if (!user) { throw new Error('User not found'); }
	    
	    var token = user.username;
	    
	    var opts = {
			name: user.displayName,
			appName: config.app.title,
			url: 'http://' + req.headers.host + '/api/activate/' + token
		};
		
		return thenify(res.render).call(res,path.resolve('modules/home/server/templates/activate-email'), opts);
	})
	.then((emailHTML) => {
	    var smtpTransport = nodemailer.createTransport(config.mailer.options);
		var mailOptions = {
			to: user.email,
			from: config.mailer.from,
			subject: 'Password Reset',
			html: emailHTML
		};
		return thenify(smtpTransport.sendMail).call(smtpTransport,mailOptions);
	})
	.then(() => {
	    res.send({
			message: 'An email has been sent to ' + user.email + ' with further instructions.'
		});
	})
	.catch((err) => {
	    res.status(400).send({ message: getErrorMessage(err) });
	});
	
};

/**
 * Activation GET from email token
 */
exports.validateActivationToken = function(req, res) {
	User.findOne({
		username: req.params.token,
		state: 'interested'
	}, function(err, user) {
		if (!user) {
			return res.redirect('/#!/activate/invalid');
		}
		
		if (!user.authenticate(req.params.token)) {
		    return res.redirect('/#!/activate/invalid');
		}

		res.redirect('/#!/activate/' + req.params.token);
	});
};

/**
 * Activation POST from email token
 */
exports.activate = function(req, res, next) {
	// Init Variables
	var activationDetails = req.body;
	var message = null;
	var user = null;

	User.findOne({
		username: req.params.token,
		state: 'interested'
	}, '-salt -password')
	.then((_user) => {
	    user = _user;
		if (!user) { 
		    throw new Error('Activation token invalid'); 
		}
		
		if (activationDetails.newPassword !== activationDetails.verifyPassword) {
		    throw new Error('Passwords do not match');
		}
		
		user.password = activationDetails.newPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;
		user.postcode = activationDetails.postcode;
		user.username = activationDetails.username;
		user.state = 'active';

        return user.save();
    })
    .then((doc) => {
        user = doc;
        return thenify(req.login).call(req,user);
    })
    .then(() => {
        // Return authenticated user
        return res.json(user);
    })
    .then(() => {
        return thenify(res.render).call(res,
            'modules/home/server/templates/activate-confirm-email', {
			    name: user.displayName,
			    appName: config.app.title
		});
	})
	.then((emailHTML) => {
	    var smtpTransport = nodemailer.createTransport(config.mailer.options);
		var mailOptions = {
			to: user.email,
			from: config.mailer.from,
			subject: 'Your account has been activated',
			html: emailHTML
		};
		
		return thenify(smtpTransport.sendMail).call(smtpTransport,mailOptions);
	})	
    .catch((err) => {
        return res.status(400).send({
			message: getErrorMessage(err)
		});
    });

};
