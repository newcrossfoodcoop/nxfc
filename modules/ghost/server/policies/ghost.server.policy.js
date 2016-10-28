'use strict';

/**
 * Module dependencies.
 */
var Acl = require('acl'),
    path = require('path');

// Using the memory backend
var acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke Ghost Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([{
		roles: ['admin', 'ghost-admin', 'ghost-editor', 'ghost-author'],
		allows: [{
			resources: '/cms',
			permissions: '*'
		}, {
			resources: '/api/ghost/login',
			permissions: ['get']		
		}]
	}, {
	    roles: ['guest', 'user'],
	    allows: [{
		    resources: '/api/ghost/posts/slug/{slug}',
		    permissions: ['get']
		}, {
		    resources: '/api/ghost/posts/tag/{tag}',
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
