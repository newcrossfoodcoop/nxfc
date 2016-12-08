'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('catalogueOrders', ['$resource',
	function($resource) {
		return $resource('/api/10/orders/:orderId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			csv: {
			    method: 'GET',
			    url: '/api/10/orders/:orderId/csv'
			}
		});
	}
]);
