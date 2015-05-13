'use strict';

angular.module('home').controller('HomeModuleController', ['$scope', '$state', 'Authentication', 'Menus',
	function($scope, $state, Authentication, Menus) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;
		$scope.magicmenu = Menus.getMenu('magicmenu');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
		
		$state.transitionTo('home.home');
	}
]);
