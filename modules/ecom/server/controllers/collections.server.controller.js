'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	path = require('path'),
	mongoose = require('mongoose'),
	Collection = mongoose.model('Collection'),
	errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a collection
 */
exports.create = function(req, res) {
	var collection = new Collection(req.body);
	collection.user = req.user;

	collection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(collection);
		}
	});
};

/**
 * Show the current collection
 */
exports.read = function(req, res) {
	res.json(req.collection);
};

/**
 * Update a collection
 */
exports.update = function(req, res) {
	var collection = req.collection;

	collection.title = req.body.title;
	collection.content = req.body.content;

	collection.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(collection);
		}
	});
};

/**
 * Delete an collection
 */
exports.delete = function(req, res) {
	var collection = req.collection;

	collection.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(collection);
		}
	});
};

/**
 * List of Collections
 */
exports.list = function(req, res) {
	Collection.find().sort('-created').populate('user', 'displayName').exec(function(err, collections) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.json(collections);
		}
	});
};

/**
 * Collection middleware
 */
exports.collectionByID = function(req, res, next, id) {
	Collection.findById(id).populate('user', 'displayName').exec(function(err, collection) {
		if (err) return next(err);
		if (!collection) return next(new Error('Failed to load collection ' + id));
		req.collection = collection;
		next();
	});
};
