'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('collections', {
			abstract: true,
			url: '/collections',
			template: '<ui-view/>'
		}).
		state('collections.list', {
			url: '',
			templateUrl: 'modules/ecom/views/collections/list-collections.client.view.html'
		}).
		state('collections.create', {
			url: '/create',
			templateUrl: 'modules/ecom/views/collections/create-collection.client.view.html'
		}).
		state('collections.view', {
			url: '/:collectionId',
			templateUrl: 'modules/ecom/views/collections/view-collection.client.view.html'
		}).
		state('collections.edit', {
			url: '/:collectionId/edit',
			templateUrl: 'modules/ecom/views/collections/edit-collection.client.view.html'
		});
		
	}
]);
