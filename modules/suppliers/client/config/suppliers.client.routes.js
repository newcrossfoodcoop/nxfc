'use strict';

//Setting up route
angular.module('suppliers').config(['$stateProvider',
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
			templateUrl: 'modules/suppliers/views/suppliers/list-suppliers.client.view.html'
		}).
		state('suppliers.create', {
			url: '/create',
			templateUrl: 'modules/suppliers/views/suppliers/create-supplier.client.view.html'
		}).
		state('suppliers.view', {
			url: '/:supplierId',
			templateUrl: 'modules/suppliers/views/suppliers/view-supplier.client.view.html'
		}).
		state('suppliers.edit', {
			url: '/:supplierId/edit',
			templateUrl: 'modules/suppliers/views/suppliers/edit-supplier.client.view.html'
		});
		
	}
]);
