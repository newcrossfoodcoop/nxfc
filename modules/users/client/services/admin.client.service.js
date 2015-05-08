'use strict';

//Users admin service used for communicating with the users REST endpoints
angular.module('users').factory('Admin', ['$resource',
	function($resource) {
		return $resource('api/users/:userId', {
			userId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
