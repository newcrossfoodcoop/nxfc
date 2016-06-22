'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		// suppliers state routing
		$stateProvider.
		state('suppliers', {
			abstract: true,
			url: '/suppliers',
			template: '<ui-view/>'
		}).
		state('suppliers.list', {
			url: '',
			templateUrl: 'modules/ecom/views/suppliers/list-suppliers.client.view.html'
		}).
		state('suppliers.create', {
			url: '/create',
			templateUrl: 'modules/ecom/views/suppliers/create-supplier.client.view.html'
		}).
		state('suppliers.view', {
			url: '/:supplierId',
			templateUrl: 'modules/ecom/views/suppliers/view-supplier.client.view.html'
		}).
		state('suppliers.edit', {
			url: '/:supplierId/edit',
			templateUrl: 'modules/ecom/views/suppliers/edit-supplier.client.view.html'
		});
		
	}
]);
