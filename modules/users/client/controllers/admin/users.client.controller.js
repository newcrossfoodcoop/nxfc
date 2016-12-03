'use strict';

angular.module('users').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Admin', '$http',
	function($scope, $stateParams, $location, Authorisation, Admin, $http) {
		$scope.authorisation = Authorisation;
		var Users = Admin;

		$scope.create = function() {
			var user = new Users($scope.user);
			user.provider = 'local';
			user.$save(function(response) {
				$location.path('users/' + response._id);

				$scope.user = {};
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(user) {
			if (user) {
				user.$remove();

				for (var i in $scope.users) {
					if ($scope.users[i] === user) {
						$scope.users.splice(i, 1);
					}
				}
			} else {
				$scope.user.$remove(function() {
					$location.path('users');
				});
			}
		};

		$scope.update = function() {
			var user = $scope.user;

			user.$update(function() {
				$location.path('users/' + user._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.users = Users.query();
		};

		$scope.findOne = function() {
			$scope.user = Users.get({
				userId: $stateParams.userId
			});
		};
		
		// Send activation 
		$scope.sendActivation = function() {
			$scope.success = $scope.error = null;
			var user = $scope.user;
			$scope.disableActivation = true;

			$http.put('/api/activate/' + user.username, {}).success(function(response) {
			    $scope.success = 'Activation email sent';
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
