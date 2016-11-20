'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('Sorders', ['$resource',
	function($resource) {
		return $resource('/api/40/orders/:sorderId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
