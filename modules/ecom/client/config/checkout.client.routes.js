'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Checkout state routing
		$stateProvider.
		state('checkout', {
		    abstract: true,
		    url: '/checkout',
		    templateUrl: 'modules/ecom/views/checkout/checkout.client.view.html',
		    controller: 'CheckoutController',
		}).
		state('checkout.profile', {
		    url: '/profile',
		    templateUrl: 'modules/ecom/views/checkout/profile.checkout.client.view.html'
		}).
		state('checkout.delivery', {
		    url: '/delivery',
		    templateUrl: 'modules/ecom/views/checkout/delivery.checkout.client.view.html'
		}).
		state('checkout.payment', {
		    url: '/payment',
		    templateUrl: 'modules/ecom/views/checkout/payment.checkout.client.view.html'
		}).
		state('confirmedOrder', {
			url: '/checkout/:method/:orderId/confirm',
			templateUrl: 'modules/ecom/views/checkout/confirmed-checkout.client.view.html',
			params: { order: null }
		}).
		state('redirectedOrder', {
			url: '/checkout/:method/:orderId/redirected?token&PayerID',
			templateUrl: 'modules/ecom/views/checkout/redirected-checkout.client.view.html'
		}).
		state('cancelledOrder', {
			url: '/checkout/:method/:orderId/cancelled?token',
			templateUrl: 'modules/ecom/views/checkout/cancelled-checkout.client.view.html'
		});
		
		$urlRouterProvider.otherwise('/checkout/profile');
	}
]);
