'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('Pickups', ['$resource',
	function($resource) {
		return $resource('/api/40/pickups/:pickupId', { 
		    pickupId: '@_id',
		    stockId: '@stockId',
		    checkoutId: '@checkoutId'
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
			createOrders: {
			    method: 'PUT',
			    url: '/api/40/pickups/:pickupId/orders'
			},
			orders: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/orders'
			},
			updateStock: {
			    method: 'PUT',
			    url: '/api/40/pickups/:pickupId/stocks/:stockId'
			},
			finaliseCheckout: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/checkouts/:checkoutId/finalise'
			},
			archive: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/archive'
			},
			open: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/open',
			    isArray: true
			},
			active: {
			    method: 'GET',
			    url: '/api/40/pickups/:pickupId/active',
			    isArray: true
			}
		});
	}
]);
