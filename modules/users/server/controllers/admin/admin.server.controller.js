'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

var util = require('util');

var config = require(path.resolve('./config/config'));
var mailchimp = require(path.resolve('./config/lib/mailchimp'));
	
var select = 'firstName lastName displayName email username profileImageURL roles updated created state postcode newsletter';

/**
 * Create a user
 */
exports.create = function(req, res) {
	var user = new User(req.body);

	user.save()
	    .then(() => {
	        return mailchimp.put(user, user.email);
	    })
	    .then(() => {
	        res.json(user);
	    })
	    .catch((err) => {
	        return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
	    });
};

/**
 * Show the current user
 */
exports.read = function(req, res) {
	res.json(req._user);
};

/**
 * Update a user
 */
exports.update = function(req, res) {
	var user = req._user;

    var original_email = user.email;

	user.displayName = req.body.firstName + ' ' + req.body.lastName;
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.username = req.body.username;
	user.email = req.body.email;
	user.roles = req.body.roles;
	user.postcode = req.body.postcode;
	user.newsletter = req.body.newsletter;

	user.save()
	    .then(() => {
	        return mailchimp.put(user, original_email);
	    })
	    .then(() => {
	        res.json(user);
	    })
	    .catch((err) => {
	        return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
	    });
};

/**
 * Delete an user
 */
exports.delete = function(req, res) {
	var user = req._user;

	user.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(user);
		}
	});
};

/**
 * List of Users
 */
exports.list = function(req, res) {
	User.find().sort('-created').select(select).exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(users);
		}
	});
};

/**
 * Mailchimp Webhook
 */
exports.mailchimp = function(req, res) {
    if (config.mailchimp.key !== req.query.key) {
        console.log('mailchimp.key not matched');
        return res.status(404).send();
    }
    if (config.mailchimp.list !== req.body.list_id) {
        console.log('mailchimp.list_id not matched');
        return res.status(404).send();
    }
    if (!req.body.merge_fields.id) {
        return res.status(400).send({message: 'no merge id'});
    }
    
    User
        .find(req.body.email)
        .select('email newsletter')
        .exec()
        .then((user) => {
            if (!user) { throw new Error('user not found'); }
            
            switch(req.body.type) {
                case 'subscribe':
                    user.newsletter = true;
                    return user.save();
                case 'unsubscribe':
                    user.newsletter = false;
                    return user.save();
                default:
                    throw new Error(util.format('type "%s" not supported',req.body.type));
            }
        })
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        });
};

/**
 * User middleware
 */
exports.userByID = function(req, res, next, id) {
	User.findById(id).select(select).exec(function(err, user) {
		if (err) return next(err);
		if (!user) return next(new Error('Failed to load user ' + id));
		
		req._user = user;
		next();
	});
};
