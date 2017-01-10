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
			resources: '/api/checkout/{method}/{checkoutOrderId}/close',
			permissions: 'get'
		}]
	},{
		roles: ['admin','user'],
		allows: [{
			resources: [
			    '/api/checkout/{method}/{checkoutOrderId}/{token}/redirected',
			    '/api/checkout/{method}/{checkoutOrderId}/{token}/cancelled'
			 ],
			permissions: ['put']
		}, {
			resources: '/api/checkout/{method}/{checkoutOrderId}/{token}/confirm',
			permissions: ['get']
		}, {
			resources: '/api/checkout/{method}',
			permissions: 'post'
		}, {
			resources: '/api/checkout/config',
			permissions: 'get'
		}]
	}]);
};

/**
 * Check If Orders Policy Allows
 */
exports.isAllowed = function(req, res, next) {
    var roles = ['guest'];
    
    // Allow a user to checkout their own order
    if (req.user) {
        roles = req.user.roles;	
	    if (req.order && req.order.user.id === req.user.id) {
		    return next();
	    }
	}
	
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
