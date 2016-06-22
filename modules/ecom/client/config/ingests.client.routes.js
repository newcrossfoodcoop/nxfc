'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
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
			templateUrl: 'modules/ecom/views/ingests/list-ingests.client.view.html'
		}).
		state('ingests.create', {
			url: '/create',
			templateUrl: 'modules/ecom/views/ingests/create-ingest.client.view.html'
		}).
		state('ingests.view', {
			url: '/:ingestId',
			templateUrl: 'modules/ecom/views/ingests/view-ingest.client.view.html'
		}).
		state('ingests.edit', {
			url: '/:ingestId/edit',
			templateUrl: 'modules/ecom/views/ingests/edit-ingest.client.view.html'
		});
		
	}
]);
