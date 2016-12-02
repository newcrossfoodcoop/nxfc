'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		
		$stateProvider.
		state('vpickups', {
			abstract: true,
			url: '/spickups/:spickupId',
			templateUrl: 'modules/ecom/views/vpickup/menu.vpickup.client.view.html'
		}).
		state('vpickups.checkouts', {
			url: '/checkouts',
			templateUrl: 'modules/ecom/views/vpickup/checkouts.vpickup.client.view.html'
		}).
		state('vpickups.orders', {
			url: '/orders',
			templateUrl: 'modules/ecom/views/vpickup/orders.vpickup.client.view.html'
		}).
		state('vpickups.actions', {
			url: '',
			templateUrl: 'modules/ecom/views/vpickup/actions.vpickup.client.view.html'
		});

	}
]);
