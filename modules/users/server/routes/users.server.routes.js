'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('../controllers/users.server.controller'),
	    admin = require('../controllers/admin/admin.server.controller'),
	    usersPolicy = require('../policies/users.server.policy');

	// Setting up the users profile api
	app.route('/api/users/me').get(users.me);
	app.route('/api/users').put(users.update);
	app.route('/api/users/accounts').delete(users.removeOAuthProvider);
	app.route('/api/users/password').post(users.changePassword);
	app.route('/api/users/picture').post(users.changeProfilePicture);

	// Users collection routes
	app.route('/api/users').all(usersPolicy.isAllowed)
		.get(admin.list)
		.post(admin.create);

	// Single user routes
	app.route('/api/users/:userId').all(usersPolicy.isAllowed)
		.get(admin.read)
		.put(admin.update)
		.delete(admin.delete);
		
	// Webhook for mailchimp subscribes/unsubscribes
	app.route('/api/webhooks/mailchimp').post(admin.mailchimp);

	// Finish by binding the user middleware
	app.param('userId', admin.userByID);
};
