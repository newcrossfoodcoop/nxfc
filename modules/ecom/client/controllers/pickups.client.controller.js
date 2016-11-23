'use strict';

// pickups controller
angular.module('ecom').controller('PickupsController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Pickups', 'Locations',
	function($scope, $stateParams, $location, Authorisation, Pickups, Locations ) {
		$scope.authorisation = Authorisation;

        $scope.locations = Locations.query();

		// Create new pickup
		$scope.create = function() {
		    console.log(this);
			// Create new pickup object
			var pickup = new Pickups ({
				description: this.description,
				start: this.start,
				end: this.end,
				location: this.location,
				state: 'open'
			});

			// Redirect after save
			pickup.$save(function(response) {
				$location.path('pickups/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing pickup
		$scope.remove = function( pickup ) {
			if ( pickup ) { pickup.$remove();

				for (var i in $scope.pickups ) {
					if ($scope.pickups [i] === pickup ) {
						$scope.pickups.splice(i, 1);
					}
				}
			} else {
				$scope.pickup.$remove(function() {
					$location.path('pickups');
				});
			}
		};

		// Update existing pickup
		$scope.update = function() {
			var pickup = $scope.pickup ;

			pickup.$update(function() {
				$location.path('pickups/' + pickup._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of pickups
		$scope.find = function() {
			$scope.pickups = Pickups.query();
		};

		// Find existing pickup
		$scope.findOne = function() {
			$scope.pickup = Pickups.get({ 
				pickupId: $stateParams.pickupId || $stateParams.spickupId
			});
		};
	}
]);
