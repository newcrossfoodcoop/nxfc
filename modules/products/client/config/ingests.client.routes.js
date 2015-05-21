'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// ingests state routing
		$stateProvider.
		state('ingests', {
			abstract: true,
			url: '/ingests',
			template: '<ui-view/>'
		}).
		state('ingests.list', {
			url: '',
			templateUrl: 'modules/products/views/ingests/list-ingests.client.view.html'
		}).
		state('ingests.create', {
			url: '/create',
			templateUrl: 'modules/products/views/ingests/create-ingest.client.view.html'
		}).
		state('ingests.view', {
			url: '/:ingestId',
			templateUrl: 'modules/products/views/ingests/view-ingest.client.view.html'
		}).
		state('ingests.edit', {
			url: '/:ingestId/edit',
			templateUrl: 'modules/products/views/ingests/edit-ingest.client.view.html'
		});
		
	}
]);
