'use strict';

angular.module('home').controller('HomeModuleController', ['$scope', '$state', 'Authentication', 'Menus', '$http',
	function($scope, $state, Authentication, Menus, $http) {
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
		
		$scope.registerInterest = function() {
			$http.post('/register-interest', $scope.credentials).success(function(response) {
				// And redirect to the index page
				$scope.response = response.message;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
