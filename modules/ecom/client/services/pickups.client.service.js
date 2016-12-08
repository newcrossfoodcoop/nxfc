'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('Pickups', ['$resource',
	function($resource) {
		return $resource('/api/40/pickups/:pickupId', { pickupId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			checkouts: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/checkouts',
			    isArray: true
			},
			close: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/close'
			},
			order: {
			    method: 'PUT',
			    url: '/api/40/pickups/:pickupId/orders'
			},
			orders: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/orders'
			}
		});
	}
]);
