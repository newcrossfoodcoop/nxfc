'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('Locations', ['$resource',
	function($resource) {
		return $resource('/api/40/locations/:locationId', { locationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
