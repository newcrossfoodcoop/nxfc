'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', '$window', 'Authentication', '$state',
	function($scope, $http, $location, $window, Authentication, $state) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			$http.post('/api/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$state.go('home.home');
//				$window.location.reload();
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
//				$location.path('/');
//				$window.location.reload();
                $state.go('home.home');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
