'use strict';

/**
 * Module dependencies.
 */
var Acl = require('acl');

// Using the memory backend
var acl = new Acl(new Acl.memoryBackend());

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
			resources: '/api/ingests/{ingestId}',
			permissions: '*'
		}, {
			resources: '/api/ingests/{ingestId}/start-run',
			permissions: '*'
		}]
	}, {
		roles: ['manager'],
		allows: [{
			resources: '/api/ingests',
			permissions: ['get']
		}, {
			resources: '/api/ingests/{ingestId}',
			permissions: ['get']
		}]
	}, {
		roles: ['manager', 'admin'],
		allows: [{
			resources: '/api/ingests/{ingestId}/runs',
			permissions: ['get']
		}, {
			resources: '/api/ingests/runs/{runId}',
			permissions: ['get']
		}, {
			resources: '/api/ingests/runs/{runId}/log',
			permissions: ['get']
		}]
	}]);
};

/**
 * Check If ingests Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];
	var resource = req.baseUrl + req.route.path;

	// Check for user roles
	acl.areAnyRolesAllowed(roles, resource, req.method.toLowerCase(), function(err, isAllowed) {
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
