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
			resources: '/api/10/ingests',
			permissions: '*'
		}, {
			resources: '/api/10/ingests/{ingestId}',
			permissions: '*'
		}, {
			resources: '/api/10/ingests/{ingestId}/start-run',
			permissions: '*'
		}]
	}, {
		roles: ['manager'],
		allows: [{
			resources: '/api/10/ingests',
			permissions: ['get']
		}, {
			resources: '/api/10/ingests/{ingestId}',
			permissions: ['get']
		}]
	}, {
		roles: ['manager', 'admin'],
		allows: [{
			resources: '/api/10/ingests/{ingestId}/runs',
			permissions: ['get']
		}, {
			resources: '/api/10/ingests/runs/{runId}',
			permissions: ['get']
		}, {
			resources: '/api/10/ingests/runs/{runId}/log',
			permissions: ['get']
		}]
	}]);
	
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/10/products',
			permissions: '*'
		}, {
			resources: '/api/10/products/{productId}',
			permissions: '*'
		}, {
			resources: '/api/10/products/all',
			permissions: '*'
		}]
	}, {
		roles: ['manager'],
		allows: [{
			resources: '/api/10/products',
			permissions: ['post']
		}]
	}, {
		roles: ['guest', 'user'],
		allows: [{
			resources: '/api/10/products',
			permissions: ['get']
		}, {
			resources: '/api/10/products/tags',
			permissions: ['get']
		}, {
			resources: '/api/10/products/categories',
			permissions: ['get']
		}, {
			resources: '/api/10/products/count',
			permissions: ['get']
		}, {
			resources: '/api/10/products/brands',
			permissions: ['get']
		}, {
			resources: '/api/10/products/suppliercodes',
			permissions: ['get']
		}, {
			resources: '/api/10/products/{productId}',
			permissions: ['get']
		}]
	}]);
	
	acl.allow([{
		roles: ['admin'],
		allows: [{
			resources: '/api/10/suppliers',
			permissions: '*'
		}, {
			resources: '/api/10/suppliers/{supplierId}',
			permissions: '*'
		}]
	}, {
		roles: ['manager'],
		allows: [{
			resources: '/api/10/suppliers',
			permissions: ['get', 'post']
		}, {
			resources: '/api/10/suppliers/{supplierId}',
			permissions: ['get']
		}]
	}, {
		roles: ['guest', 'user'],
		allows: [{
			resources: '/api/10/suppliers',
			permissions: ['get']
		}, {
			resources: '/api/10/suppliers/{supplierId}',
			permissions: ['get']
		}]
	}]);
	
	acl.allow([{
	    roles: ['admin'],
		allows: [{
			resources: '/api/10/orders',
			permissions: '*'
		}, {
			resources: '/api/10/orders/{orderId}',
			permissions: '*'
		}, {
		    resources: '/api/10/orders/{orderId}/csv',
			permissions: '*'
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
