'use strict';

// locations controller
angular.module('ecom').controller('LocationsController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Locations',
	function($scope, $stateParams, $location, Authorisation, Locations ) {
		$scope.authorisation = Authorisation;

		// Create new location
		$scope.create = function() {
			// Create new location object
			var location = new Locations ({
				name: this.name,
				url: this.url,
				address: this.address,
				description: this.description
			});

			// Redirect after save
			location.$save(function(response) {
				$location.path('locations/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing location
		$scope.remove = function( location ) {
			if ( location ) { location.$remove();

				for (var i in $scope.locations ) {
					if ($scope.locations [i] === location ) {
						$scope.locations.splice(i, 1);
					}
				}
			} else {
				$scope.location.$remove(function() {
					$location.path('locations');
				});
			}
		};

		// Update existing location
		$scope.update = function() {
			var location = $scope.location ;

			location.$update(function() {
				$location.path('locations/' + location._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of locations
		$scope.find = function() {
			$scope.locations = Locations.query();
		};

		// Find existing location
		$scope.findOne = function() {
			$scope.location = Locations.get({ 
				locationId: $stateParams.locationId
			});
		};
	}
]);
