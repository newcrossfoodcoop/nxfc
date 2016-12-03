'use strict';

// Setting up route
angular.module('home').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
	
		// Home state routing
		$stateProvider.
		state('home', {
			abstract: true,
			templateUrl: 'modules/home/views/menu.client.view.html'
		}).
		state('home.home', {
		    url: '/',
			templateUrl: 'modules/home/views/home.client.view.html'
		}).
		state('home.how', {
			url: '/how',
			templateUrl: 'modules/home/views/default.client.view.html'
		}).
		state('home.about', {
			url: '/about',
			templateUrl: 'modules/home/views/default.client.view.html'
		}).
		state('home.communities', {
			url: '/communities',
			templateUrl: 'modules/home/views/default.client.view.html'
		}).
		state('home.recipes', {
			url: '/recipes',
			templateUrl: 'modules/home/views/default.client.view.html'
		}).
		state('home.shop', {
			url: '/shop',
			templateUrl: 'modules/home/views/shop.client.view.html'
		}).
		state('home.preview', {
			url: '/preview',
			templateUrl: 'modules/home/views/preview.client.view.html'
		}).
		state('home.view-product', {
		    url: '/shop/products/:productId',
		    templateUrl: 'modules/products/views/products/view-product.client.view.html'
		}).
		state('home.signup', {
			url: '/home/signup',
			templateUrl: 'modules/home/views/signup.client.view.html'
		}).
		state('activate', {
			abstract: true,
			url: '/activate',
			template: '<ui-view/>'
		}).
		state('activate.invalid', {
			url: '/invalid',
			templateUrl: 'modules/home/views/activate/activate-invalid.client.view.html'
		}).
		state('activate.success', {
			url: '/success',
			templateUrl: 'modules/home/views/activate/activate-success.client.view.html'
		}).
		state('activate.form', {
			url: '/:token',
			templateUrl: 'modules/home/views/activate/activate.client.view.html'
		});
	}
]);
