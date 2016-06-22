'use strict';

//Collections service used for communicating with the collections REST endpoints
angular.module('ecom').factory('Collections', ['$resource',
	function($resource) {
		return $resource('api/collections/:collectionId', {
			collectionId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
