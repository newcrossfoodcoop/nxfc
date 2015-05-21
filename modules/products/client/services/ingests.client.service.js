'use strict';

//ingests service used to communicate ingests REST endpoints
angular.module('products').factory('Ingests', ['$resource',
	function($resource) {
		return $resource('/api/ingests/:ingestId', { ingestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
