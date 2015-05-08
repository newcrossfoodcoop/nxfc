'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
	
var select = 'firstName lastName displayName email username profileImageURL roles updated created';

/**
 * Create a user
 */
exports.create = function(req, res) {
	var user = new User(req.body);

	user.save(function(err) {
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

	user.displayName = req.body.firstName + ' ' + req.body.lastName;
	user.firstName = req.body.firstName;
	user.lastName = req.body.lastName;
	user.username = req.body.username;
	user.email = req.body.email;
	user.roles = req.body.roles;

	user.save(function(err) {
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
