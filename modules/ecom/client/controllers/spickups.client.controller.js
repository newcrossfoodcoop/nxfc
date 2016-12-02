'use strict';

// pickups controller
angular.module('ecom').controller('SpickupsController', [
            '$scope', '$stateParams', '$location', 'Authorisation', 'Pickups', 
            'Locations', '$state', 'Menus', 'Authentication', 'lodash',
	function($scope, $stateParams, $location, Authorisation, Pickups,
	         Locations, $state, Menus, Authentication, lodash) {
	         
		$scope.authorisation = Authorisation;

        // Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;
		$scope.pickupmenu = Menus.getMenu('pickupmenu');

		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});

		// Find existing pickup
		$scope.findOne = function() {
			$scope.pickup = Pickups.get({ 
				pickupId: $stateParams.spickupId
			});
		};
		
		// Find checkouts
		$scope.findCheckouts = function() {
			$scope.checkouts = Pickups.checkouts({ 
				pickupId: $stateParams.spickupId
			});
		};
		
		$scope.reduceCheckouts = function() {
		    Pickups.checkouts({ 
				pickupId: $stateParams.spickupId
			}).$promise.then(function(checkouts) {
			    var s = $scope.rcheckouts = {};
			    lodash(checkouts)
//			$scope.rcheckouts = lodash(Pickups.checkouts({ 
//			    pickupId: $stateParams.spickupId
//		    }))
	            .map(function(checkout) {
	                console.log(checkout);
	                if (checkout._id.state === 'confirmed') {
	                    return checkout.stock;
	                }
	            })
	            .filter()
	            .flatten()
	            .reduce(function(summary, entry) {
                    var supplier = summary[entry.supplierId];
                    if (!supplier) {
                        summary[entry.supplierId] = supplier = {};
                    }
                    if (supplier[entry.productId]) {
                        supplier[entry.productId].quantity += entry.quantity;
                    }
                    else {
                        supplier[entry.productId] = lodash.pick(entry, ['name','quantity','price','cost']);
                    }
	            },s);
		    });
		};
	}
]);
