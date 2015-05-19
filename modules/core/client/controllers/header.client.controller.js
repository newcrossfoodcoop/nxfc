'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus', 'Basket',
	function($scope, $state, Authentication, Menus, Basket) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;
		$scope.menu = Menus.getMenu('topbar');
		
		$scope.totalItems = Basket.totalItems;

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);


