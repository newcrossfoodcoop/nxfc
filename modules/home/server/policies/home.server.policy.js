'use strict';

/**
 * Module dependencies.
 */
var Acl = require('acl');

// Using the memory backend
var acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Users Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin','manager'],
		allows: [{
			resources: '/api/activate/:token',
			permissions: 'put'
		}]
	}, {
		roles: ['guest'],
		allows: [{
			resources: '/api/activate/:token',
			permissions: ['post','get']
		}]
	}]);
};

/**
 * Check If Home Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];

	// Check for user roles
	acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function(err, isAllowed) {
		if (err) {
			// An authorization error occurred.
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}
	});
};
