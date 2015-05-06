'use strict';

// Setting up route
angular.module('ghost').config(['$stateProvider',
	function($stateProvider) {
		// Articles state routing
		$stateProvider.
		state('ghost', {
			abstract: true,
			url: '/ghost',
			template: '<ui-view/>'
		}).
		state('ghost.preview', {
			url: '',
			templateUrl: 'modules/ghost/views/preview-ghost.client.view.html'
		}).
		state('ghost.admin', {
			url: '/admin',
			templateUrl: 'modules/ghost/views/admin-ghost.client.view.html'
		});
	}
]);
