'use strict';

/**
 * Module dependencies.
 */
var Acl = require('acl');

// Using the memory backend
var acl = new Acl(new Acl.memoryBackend());

/**
 * Invoke suppliers Permissions
 */
exports.invokeRolesPolicies = function() {
	acl.allow([
	    {
		    roles: ['admin'],
		    allows: [
		        {
			        resources: '/api/40/locations',
			        permissions: '*'
		        }, 
		        {
			        resources: '/api/40/locations/{locationId}',
			        permissions: '*'
		        },
		        {
			        resources: '/api/40/pickups',
			        permissions: '*'
		        }, 
		        {
			        resources: '/api/40/pickups/{pickupId}',
			        permissions: '*'
		        },
		        {
			        resources: '/api/40/pickups/{pickupId}/close',
			        permissions: 'get'
		        },
		        {
			        resources: '/api/40/pickups/{pickupId}/orders',
			        permissions: ['get','put']
		        },
		        {
			        resources: '/api/40/pickups/{pickupId}/checkouts',
			        permissions: 'get'
		        },
		        {
			        resources: '/api/40/checkouts',
			        permissions: 'get'
		        }, 
		        {
			        resources: '/api/40/checkouts/{checkoutId}',
			        permissions: 'get'
		        },
		        {
			        resources: '/api/40/checkouts/{checkoutId}/stock',
			        permissions: 'get'
		        },
		        {
			        resources: '/api/40/orders',
			        permissions: 'get'
		        }, 
		        {
			        resources: '/api/40/orders/{orderId}/delivered',
			        permissions: 'put'
		        }
	        ]
	    },
	    {
	        roles: ['manager'],
	        allows: [
	            {
			        resources: '/api/40/pickups/{pickupId}',
			        permissions: 'get'
		        },
		        {
			        resources: '/api/40/pickups/{pickupId}/close',
			        permissions: 'get'
		        },
		        {
			        resources: '/api/40/pickups/{pickupId}/orders',
			        permissions: ['get','put']
		        },
		        {
			        resources: '/api/40/pickups/{pickupId}/checkouts',
			        permissions: 'get'
		        },
	        ]
	    },
	    {
		    roles: ['user', 'guest'],
		    allows: [
		        {
		            resources: '/api/40/pickups',
			        permissions: 'get'
		        }
		    ]
		}
	]);
};

/**
 * Check If stock Policy Allows
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
