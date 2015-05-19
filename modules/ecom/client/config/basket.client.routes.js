'use strict';

//Setting up route
angular.module('ecom').config(['$stateProvider',
	function($stateProvider) {
		// Basket state routing
		$stateProvider.
		state('basket', {
			url: '/basket',
			templateUrl: 'modules/ecom/views/basket.client.view.html'
		});
	}
]);
