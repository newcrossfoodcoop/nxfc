'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
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
			templateUrl: 'modules/ecom/views/products/list-products.client.view.html'
		}).
		state('products.create', {
			url: '/create',
			templateUrl: 'modules/ecom/views/products/create-product.client.view.html'
		}).
		state('products.view', {
			url: '/:productId',
			templateUrl: 'modules/ecom/views/products/view-product.client.view.html'
		}).
		state('products.edit', {
			url: '/:productId/edit',
			templateUrl: 'modules/ecom/views/products/edit-product.client.view.html'
		});
		
	}
]);
