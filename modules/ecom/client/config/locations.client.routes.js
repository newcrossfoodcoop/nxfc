'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		// locations state routing
		$stateProvider.
		state('locations', {
			abstract: true,
			url: '/locations',
			template: '<ui-view/>'
		}).
		state('locations.list', {
			url: '',
			templateUrl: 'modules/ecom/views/locations/list-locations.client.view.html'
		}).
		state('locations.create', {
			url: '/create',
			templateUrl: 'modules/ecom/views/locations/create-location.client.view.html'
		}).
		state('locations.view', {
			url: '/:locationId',
			templateUrl: 'modules/ecom/views/locations/view-location.client.view.html'
		}).
		state('locations.edit', {
			url: '/:locationId/edit',
			templateUrl: 'modules/ecom/views/locations/edit-location.client.view.html'
		});
		
	}
]);
