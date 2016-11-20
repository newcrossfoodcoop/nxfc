'use strict';

// pickups controller
angular.module('ecom').controller('SpickupsController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Pickups', 'Locations',
	function($scope, $stateParams, $location, Authorisation, Pickups, Locations ) {
		$scope.authorisation = Authorisation;

		// Find existing pickup
		$scope.findOne = function() {
			$scope.pickup = Pickups.get({ 
				pickupId: $stateParams.spickupId
			});
		};
	}
]);
