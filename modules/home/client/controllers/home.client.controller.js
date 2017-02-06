'use strict';

angular.module('home').controller('HomeModuleController', ['$scope', '$state', 'Authentication', 'Menus', '$http', '$stateParams', '$location',
	function($scope, $state, Authentication, Menus, $http, $stateParams, $location) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;
		$scope.magicmenu = Menus.getMenu('magicmenu');
		$scope.activationDetails = {newsletter: true};

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
		
		// Activate user 
		$scope.activateUser = function() {
			$scope.success = $scope.error = null;

			$http.post('/api/activate/' + $stateParams.token, $scope.activationDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.activationDetails = {newsletter: true};
				$scope.success = 'Account Activated!';

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/activate/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		
		
	}
]);
