'use strict';

// pickups controller
angular.module('ecom').controller('SpickupsController', [
            '$scope', '$stateParams', '$location', 'Authorisation', 'Pickups', 
            'Locations', '$state', 'Menus', 'Authentication', 'lodash',
            'catalogueOrders',
	function($scope, $stateParams, $location, Authorisation, Pickups,
	         Locations, $state, Menus, Authentication, lodash,
	         catalogueOrders) {
	         
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
			$scope.pickup = Pickups.orders({ 
				pickupId: $stateParams.spickupId
			});
		};
		
		// Find checkouts
		$scope.findCheckouts = function() {
			$scope.checkouts = Pickups.checkouts({ 
				pickupId: $stateParams.spickupId
			});
		};
		
		// Find actions
		$scope.findActions = function() {
		    Pickups.orders({ 
				pickupId: $stateParams.spickupId
			})
			.$promise
			.then(function(pickup) {
			    $scope.pickup = pickup;
			    if (pickup.orders.length) {
			        $scope.csvOrderId = pickup.orders[0].supplierOrderId;
			    }
			});
			
			$scope.close = function() {
			    Pickups.close({ 
				    pickupId: $stateParams.spickupId
			    })
			    .$promise
			    .then(function(pickup) { $scope.pickup.state = pickup.state; })
			    .catch(function(err) { $scope.error = err.data.message; });
			};
			
		    $scope.order = function() {
		        console.log($stateParams.spickupId);
		        Pickups.createOrders({ 
				    pickupId: $stateParams.spickupId,
				    _id: $stateParams.spickupId
			    })
			    .$promise
			    .then(function(pickup) { 
			        $scope.pickup = pickup;
			        if (pickup.orders.length) {
			            $scope.csvOrderId = pickup.orders[0].supplierOrderId;
			        } 
			    })
			    .catch(function(err) { $scope.error = err.data.message; });
			};
		};
		
		$scope.reduceCheckouts = function() {
		    Pickups.checkouts({ 
				pickupId: $stateParams.spickupId
			}).$promise.then(function(checkouts) {
			    var s = $scope.rcheckouts = {};
			    lodash(checkouts)
	                .map(function(checkout) {
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
                        return summary;
	                },s);
		    });
		};
	}
]);
