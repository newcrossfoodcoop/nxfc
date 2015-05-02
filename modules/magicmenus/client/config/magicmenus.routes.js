'use strict';

// Setting up route
angular.module('magicmenus').config(['$stateProvider',
	function($stateProvider) {
		// State routing
		$stateProvider.
		state('how', {
			abstract: true,
			url: '/how',
			templateUrl: 'modules/magicmenus/views/view-how.html'
		}).
		state('about', {
			abstract: true,
			url: '/about',
			templateUrl: 'modules/magicmenus/views/view-about.html'
		}).
		state('communities', {
			abstract: true,
			url: '/communities',
			templateUrl: 'modules/magicmenus/views/view-communities.html'
		}).
		state('recipes', {
			abstract: true,
			url: '/recipes',
			templateUrl: 'modules/magicmenus/views/view-recipes.html'
		}).
		state('shop', {
			abstract: true,
			url: '/shop',
			templateUrl: 'modules/magicmenus/views/view-shop.html'
		}).
		state('how.s1', {
			url: '/s1',
			templateUrl: 'modules/magicmenus/views/view-how-s1.html'
		}).
		state('how.s2', {
			url: '/s2',
			templateUrl: 'modules/magicmenus/views/view-how-s2.html'
		}).
		state('how.s3', {
			url: '/s3',
			templateUrl: 'modules/magicmenus/views/view-how-s3.html'
		}).
		state('about.s1', {
			url: '/s1',
			templateUrl: 'modules/magicmenus/views/view-about-s1.html'
		}).
		state('about.s2', {
			url: '/s2',
			templateUrl: 'modules/magicmenus/views/view-about-s2.html'
		}).
		state('about.s3', {
			url: '/s3',
			templateUrl: 'modules/magicmenus/views/view-about-s3.html'
		}).
		state('communities.s1', {
			url: '/s1',
			templateUrl: 'modules/magicmenus/views/view-communities-s1.html'
		}).
		state('communities.s2', {
			url: '/s2',
			templateUrl: 'modules/magicmenus/views/view-communities-s2.html'
		}).
		state('communities.s3', {
			url: '/s3',
			templateUrl: 'modules/magicmenus/views/view-communities-s3.html'
		}).
		state('recipes.s1', {
			url: '/s1',
			templateUrl: 'modules/magicmenus/views/view-recipes-s1.html'
		}).
		state('recipes.s2', {
			url: '/s2',
			templateUrl: 'modules/magicmenus/views/view-recipes-s2.html'
		}).
		state('recipes.s3', {
			url: '/s3',
			templateUrl: 'modules/magicmenus/views/view-recipes-s3.html'
		}).
		state('shop.s1', {
			url: '/s1',
			templateUrl: 'modules/magicmenus/views/view-shop-s1.html'
		}).
		state('shop.s2', {
			url: '/s2',
			templateUrl: 'modules/magicmenus/views/view-shop-s2.html'
		}).
		state('shop.s3', {
			url: '/s3',
			templateUrl: 'modules/magicmenus/views/view-shop-s3.html'
		});
	}
]);
