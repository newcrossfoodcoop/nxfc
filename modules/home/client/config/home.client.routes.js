'use strict';

// Setting up route
angular.module('home').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/home/views/menu.client.view.html'
		}).
		state('home.home', {
			templateUrl: 'modules/home/views/home.client.view.html'
		}).
		state('home.how', {
			url: 'how',
			templateUrl: 'modules/home/views/how.client.view.html'
		}).
		state('home.about', {
			url: 'about',
			templateUrl: 'modules/home/views/about.client.view.html'
		}).
		state('home.communities', {
			url: 'communities',
			templateUrl: 'modules/home/views/communities.client.view.html'
		}).
		state('home.recipes', {
			url: 'recipes',
			templateUrl: 'modules/home/views/recipes.client.view.html'
		}).
		state('home.shop', {
			url: 'shop',
			templateUrl: 'modules/home/views/shop.client.view.html'
		});
	}
]);
