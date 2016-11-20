'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('spickups', {
			abstract: true,
			url: '/spickups',
			template: '<ui-view/>'
		}).
		state('spickups.view', {
			url: '/:spickupId',
			templateUrl: 'modules/ecom/views/pickups/view-pickup.client.view.html'
		});
	}
]);
