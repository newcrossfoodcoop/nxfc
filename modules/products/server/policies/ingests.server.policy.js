'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke ingests Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/ingests',
			permissions: '*'
		}, {
			resources: '/api/ingests/:ingestId',
			permissions: '*'
		}, {
			resources: '/api/ingests/:ingestId/run',
			permissions: '*'
		}]
	}, {
		roles: ['manager'],
		allows: [{
			resources: '/api/ingests',
			permissions: ['get', 'post']
		}, {
			resources: '/api/ingests/:ingestId',
			permissions: ['get']
		}]
	}, {
		roles: ['guest', 'user'],
		allows: [{
			resources: '/api/ingests',
			permissions: ['get']
		}, {
			resources: '/api/ingests/:ingestId',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If ingests Policy Allows
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
