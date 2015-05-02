'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/Wireframe layout.html'
		}).
		state('how', {
			abstract: true,
			url: '/how',
			templateUrl: 'modules/core/views/view-how.html'
		}).
		state('about', {
			abstract: true,
			url: '/about',
			templateUrl: 'modules/core/views/view-about.html'
		}).
		state('communities', {
			abstract: true,
			url: '/communities',
			templateUrl: 'modules/core/views/view-communities.html'
		}).
		state('recipes', {
			abstract: true,
			url: '/recipes',
			templateUrl: 'modules/core/views/view-recipes.html'
		}).
		state('shop', {
			abstract: true,
			url: '/shop',
			templateUrl: 'modules/core/views/view-shop.html'
		}).
		state('how.s1', {
			url: '/s1',
			templateUrl: 'modules/core/views/view-how-s1.html'
		}).
		state('how.s2', {
			url: '/s2',
			templateUrl: 'modules/core/views/view-how-s2.html'
		}).
		state('how.s3', {
			url: '/s3',
			templateUrl: 'modules/core/views/view-how-s3.html'
		}).
		state('about.s1', {
			url: '/s1',
			templateUrl: 'modules/core/views/view-about-s1.html'
		}).
		state('about.s2', {
			url: '/s2',
			templateUrl: 'modules/core/views/view-about-s2.html'
		}).
		state('about.s3', {
			url: '/s3',
			templateUrl: 'modules/core/views/view-about-s3.html'
		}).
		state('communities.s1', {
			url: '/s1',
			templateUrl: 'modules/core/views/view-communities-s1.html'
		}).
		state('communities.s2', {
			url: '/s2',
			templateUrl: 'modules/core/views/view-communities-s2.html'
		}).
		state('communities.s3', {
			url: '/s3',
			templateUrl: 'modules/core/views/view-communities-s3.html'
		}).
		state('recipes.s1', {
			url: '/s1',
			templateUrl: 'modules/core/views/view-recipes-s1.html'
		}).
		state('recipes.s2', {
			url: '/s2',
			templateUrl: 'modules/core/views/view-recipes-s2.html'
		}).
		state('recipes.s3', {
			url: '/s3',
			templateUrl: 'modules/core/views/view-recipes-s3.html'
		}).
		state('shop.s1', {
			url: '/s1',
			templateUrl: 'modules/core/views/view-shop-s1.html'
		}).
		state('shop.s2', {
			url: '/s2',
			templateUrl: 'modules/core/views/view-shop-s2.html'
		}).
		state('shop.s3', {
			url: '/s3',
			templateUrl: 'modules/core/views/view-shop-s3.html'
		});
	}
]);
