'use strict';

/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	Order = mongoose.model('Order'),
	Payment = mongoose.model('Payment'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Order already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Order
 */
//exports.create = function(req, res) {
//	var order = new Order(req.body);
//	order.user = req.user;
//	
//	// orders can only be created in the new state and modifications are
//	// managed through contoller methods (no bare updates)
//    order.state = 'new'; 

//	order.save(function(err) {
//		if (err) {
//			return res.send(400, {
//				message: getErrorMessage(err)
//			});
//		} else {
//			res.jsonp(order);
//		}
//	});
//};

/**
 * Show the current Order
 */
exports.read = function(req, res) {
	res.jsonp(req.order);
};

/**
 * Delete an Order (don't actually delete it though)
 */
exports.delete = function(req, res) {
	var order = req.order ;

    order.state = 'deleted';
	order.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(order);
		}
	});
};

/**
 * List of Orders (not deleted ones)
 */
exports.list = function(req, res) { 
    Order.find({state: { $ne: 'deleted' }}).sort('-created').populate('user', 'displayName').exec(function(err, orders) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

exports.history = function(req, res) {
    Order.find({state: { $ne: 'deleted' }, user: req.user }).sort('-created').populate('user', 'displayName').exec(function(err, orders) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(orders);
		}
	});
};

/**
 * Order middleware
 */
exports.orderByID = function(req, res, next, id) { Order.findById(id).where({state: { $ne: 'deleted' }}).populate('user', 'displayName').populate('payments').exec(function(err, order) {
		if (err) return next(err);
		if (! order) return next(new Error('Failed to load Order ' + id));
		req.order = order ;
		next();
	});
};
