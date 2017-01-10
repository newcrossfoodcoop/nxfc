'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('orders', {
			abstract: true,
			url: '/orders',
			template: '<ui-view/>'
		}).
		state('orders.list', {
			url: '',
			templateUrl: 'modules/ecom/views/orders/list-orders.client.view.html'
		}).
		state('orders.history', {
			url: '/history',
			templateUrl: 'modules/ecom/views/orders/order-history.client.view.html'
		}).
		state('orders.view', {
			url: '/:orderId',
			templateUrl: 'modules/ecom/views/orders/view-order.client.view.html'
		}).
		state('orders.edit', {
			url: '/:orderId/edit',
			templateUrl: 'modules/ecom/views/orders/edit-order.client.view.html'
		});
		
	}
]);
