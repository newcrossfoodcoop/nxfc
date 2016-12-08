'use strict';

//suppliers service used to communicate suppliers REST endpoints
angular.module('ecom').factory('Suppliers', ['$resource',
	function($resource) {
		return $resource('/api/10/suppliers/:supplierId', { supplierId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
