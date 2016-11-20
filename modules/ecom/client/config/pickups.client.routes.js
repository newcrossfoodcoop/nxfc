'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		// pickups state routing
		$stateProvider.
		state('pickups', {
			abstract: true,
			url: '/pickups',
			template: '<ui-view/>'
		}).
		state('pickups.list', {
			url: '',
			templateUrl: 'modules/ecom/views/pickups/list-pickups.client.view.html'
		}).
		state('pickups.create', {
			url: '/create',
			templateUrl: 'modules/ecom/views/pickups/create-pickup.client.view.html'
		}).
		state('pickups.view', {
			url: '/:pickupId',
			templateUrl: 'modules/ecom/views/pickups/view-pickup.client.view.html'
		}).
		state('pickups.edit', {
			url: '/:pickupId/edit',
			templateUrl: 'modules/ecom/views/pickups/edit-pickup.client.view.html'
		});
	}
]);
