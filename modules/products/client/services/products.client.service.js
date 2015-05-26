'use strict';

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('/api/products/:productId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			count: {
			    method: 'GET',
			    url: '/api/products/count'
			},
			tags: {
			    method: 'GET',
			    url: '/api/products/tags',
			    isArray: true
			},
			brands: {
			    method: 'GET',
			    url: '/api/products/brands',
			    isArray: true
			},
			supplierCodes: {
			    method: 'GET',
			    url: '/api/products/supplierCodes',
			    isArray: true
			}
		});
	}
]);
