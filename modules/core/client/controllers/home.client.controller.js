'use strict';

angular.module('home').controller('HomeController', ['$scope', '$state','Authentication',
	function($scope, $state, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		$state.transitionTo('home.home');
	}
]);
