'use strict';

//Products service used to communicate Products REST endpoints
angular.module('ecom').factory('Products', ['$resource',
	function($resource) {
		return $resource('/api/10/products/:productId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
			count: {
			    method: 'GET',
			    url: '/api/10/products/count'
			},
			tags: {
			    method: 'GET',
			    url: '/api/10/products/tags',
			    isArray: true
			},
			categories: {
			    method: 'GET',
			    url: '/api/10/products/categories',
			    isArray: true
			},
			all: {
			    method: 'GET',
			    url: '/api/10/products/all',
			    isArray: true
			},
			brands: {
			    method: 'GET',
			    url: '/api/10/products/brands',
			    isArray: true
			},
			supplierCodes: {
			    method: 'GET',
			    url: '/api/10/products/supplierCodes',
			    isArray: true
			}
		});
	}
]);
