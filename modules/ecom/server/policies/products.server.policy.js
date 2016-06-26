'use strict';

/**
 * Module dependencies.
 */
var Acl = require('acl');

// Using the memory backend
var acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Products Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/products',
			permissions: '*'
		}, {
			resources: '/api/products/:productId',
			permissions: '*'
		}]
	}, {
		roles: ['manager'],
		allows: [{
			resources: '/api/products',
			permissions: ['post']
		}]
	}, {
		roles: ['guest', 'user'],
		allows: [{
			resources: '/api/products',
			permissions: ['get']
		}, {
			resources: '/api/products/tags',
			permissions: ['get']
		}, {
			resources: '/api/products/count',
			permissions: ['get']
		}, {
			resources: '/api/products/brands',
			permissions: ['get']
		}, {
			resources: '/api/products/suppliercodes',
			permissions: ['get']
		}, {
			resources: '/api/products/:productId',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If Products Policy Allows
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
