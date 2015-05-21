'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('products', {
			abstract: true,
			url: '/products',
			template: '<ui-view/>'
		}).
		state('products.list', {
			url: '',
			templateUrl: 'modules/products/views/products/list-products.client.view.html'
		}).
		state('products.create', {
			url: '/create',
			templateUrl: 'modules/products/views/products/create-product.client.view.html'
		}).
		state('products.view', {
			url: '/:productId',
			templateUrl: 'modules/products/views/products/view-product.client.view.html'
		}).
		state('products.edit', {
			url: '/:productId/edit',
			templateUrl: 'modules/products/views/products/edit-product.client.view.html'
		});
		
	}
]);
