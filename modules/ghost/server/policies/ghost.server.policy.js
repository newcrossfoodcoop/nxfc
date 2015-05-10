'use strict';

/**
 * Module dependencies.
 */
var acl = require('acl'),
    path = require('path'),
    config = require(path.resolve('./config/config')).modules.ghost;

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Ghost Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin', 'ghost-admin', 'ghost-editor', 'ghost-author'],
		allows: [{
			resources: config.subdir,
			permissions: '*'
		}, {
			resources: '/api/ghost/login',
			permissions: ['get']		
		}]
	}]);
};

/**
 * Check If Ghost Policy Allows
 */
exports.isAllowed = function(req, res, next) {
	var roles = (req.user) ? req.user.roles : ['guest'];
    var urlPath = req.route ? req.route.path : req.baseUrl;

	// Check for user roles
	acl.areAnyRolesAllowed(roles, urlPath, req.method.toLowerCase(), function(err, isAllowed) {
		if (err) {
			// An authorization error occurred.
			return res.status(500).send('Unexpected authorization error');
		} else {
			if (isAllowed) {
				// Access granted! Invoke next middleware
				return next();
			} else {
			    console.log('403', urlPath, roles, req.user);
				return res.status(403).json({
					message: 'User is not authorized'
				});
			}
		}
	});
};
