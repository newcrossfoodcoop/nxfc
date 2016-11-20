'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('Scheckouts', ['$resource',
	function($resource) {
		return $resource('/api/40/checkouts/:scheckoutId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
