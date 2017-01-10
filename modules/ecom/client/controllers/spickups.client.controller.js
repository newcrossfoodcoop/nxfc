'use strict';

// pickups controller
angular.module('ecom').controller('SpickupsController', [
            '$scope', '$stateParams', '$location', 'Authorisation', 'Pickups', 
            'Locations', '$state', 'Menus', 'Authentication', 'lodash',
            'catalogueOrders', 'Suppliers',
	function($scope, $stateParams, $location, Authorisation, Pickups,
	         Locations, $state, Menus, Authentication, lodash,
	         catalogueOrders, Suppliers) {
	         
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
		
		var states = ['reserved', 'ordered', 'delivered', 'picked', 'pickedup'];
		
		function setCheckboxes(entry, skip) {
		    var found = false;
		    if (entry.state === 'cancelled') {
		        lodash.each(states, function(state) {
		            entry.checkboxes[state] = false;
		        });
		        entry.checkboxes.cancelled = true;
		    }
		    else {
		        lodash.each(states, function(state) {
		            if (state !== skip) {
		                entry.checkboxes[state] = !found;
		            } 
		            if (state === entry.state) {
		                found = true;
		            }  
		        });
		        entry.checkboxes.cancelled = false;
		    }
		} 
		
		$scope.currentCheckout = 1;
		
		// Find checkouts
		$scope.findCheckouts = function() {
			return Pickups.checkouts({ 
				pickupId: $stateParams.spickupId
			})
			.$promise
			.then(function(checkouts) {
		        return lodash.each(checkouts,function(checkout) {
//                    if (checkout._id.state === 'confirmed') {
                        lodash.each(checkout.stock, function(entry) {
                            entry.user = checkout._id.user;
                            entry.created = new Date(entry.created);
                            entry.checkboxes = {};
                            setCheckboxes(entry);
//                            var supplier = suppliers[entry.supplierId];
//                            if (supplier.stock) { supplier.stock.push(entry); }
//                            else { supplier.stock = [entry]; }
                        });
//                    }
                });
		    })
		    .then(function(checkouts) {
		        $scope.totalCheckouts = checkouts.length;
		        $scope.checkouts = checkouts;
		    })
		    .catch(function(err) { $scope.error = err.data.message; });
		};
		
        $scope.finaliseCheckout = function(checkout) {
            Pickups.finaliseCheckout({
                pickupId: checkout._id.pickup,
                checkoutId: checkout._id._id
            })
            .$promise
            .then(function(res) {
                checkout._id.state = res.state;
            })
            .catch(function(err) { $scope.error = err.data.message; });
        };
        
        $scope.archive = function() {
            var pickup = $scope.pickup;
            pickup
                .$archive()
                .then(function(_pickup) { $scope.pickup = _pickup; })
                .catch(function(err) { $scope.error = err.data.message; });
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
		
//		$scope.reduceCheckouts = function() {
//		    Pickups.checkouts({ 
//				pickupId: $stateParams.spickupId
//			}).$promise.then(function(checkouts) {
//			    var s = $scope.rcheckouts = {};
//			    lodash(checkouts)
//	                .map(function(checkout) {
//	                    if (checkout._id.state === 'confirmed') {
//	                        return checkout.stock;
//	                    }
//	                })
//	                .filter()
//	                .flatten()
//	                .reduce(function(summary, entry) {
//                        var supplier = summary[entry.supplierId];
//                        if (!supplier) {
//                            summary[entry.supplierId] = supplier = {};
//                        }
//                        if (supplier[entry.productId]) {
//                            supplier[entry.productId].quantity += entry.quantity;
//                        }
//                        else {
//                            supplier[entry.productId] = lodash.pick(entry, ['name','quantity','price','cost']);
//                        }
//                        return summary;
//	                },s);
//		    });
//		};
		
		$scope.checked = function checked(clicked,entry) {
		    
		    var newState = null;
		    if (entry.checkboxes[clicked] && entry.state !== clicked) {
		        newState = clicked;
		    }
		    if (entry.state === clicked) {
		        newState = states[states.indexOf(clicked) - 1] || states[0];
		    }
		    else {
		        newState = clicked;
		    }
		    
		    Pickups.updateStock({ 
//			    _id: $stateParams.spickupId,
			    pickupId: $stateParams.spickupId,
			    stockId: entry._id
		    }, { state: newState })
		    .$promise
		    .then(function() {
		        entry.state = newState; 
		        setCheckboxes(entry, clicked); 
		    })
		    .catch(function(err) { $scope.error = err.data.message; });

		};
		
		$scope.cancel = function cancel(entry) {
		    Pickups.updateStock({ 
//			    _id: $stateParams.spickupId,
			    pickupId: $stateParams.spickupId,
			    stockId: entry._id
		    }, { state: 'cancelled' })
		    .$promise
		    .then(function() {
		        entry.state = 'cancelled';
		        lodash.each(states, function(state) {
		            entry.checkboxes[state] = false;
		        });
		        setCheckboxes(entry); 
		    })
		    .catch(function(err) { $scope.error = err.data.message; });
		};
		
		$scope.reduceCheckouts = function() {
		    var suppliers = {};
		    var rval = [];
		    
		    Suppliers.query().$promise
		        .then(function(_suppliers) {
		            rval = _suppliers;
		            lodash.each(_suppliers, function(supplier) {
		                suppliers[supplier._id] = supplier;
		            });
		            return Pickups.checkouts({ 
				        pickupId: $stateParams.spickupId
			        }).$promise;
			    })
			    .then(function(checkouts) {
			       
			        return lodash.each(checkouts,function(checkout) {
//                        if (checkout._id.state === 'confirmed') {
                            lodash.each(checkout.stock, function(entry) {
                                entry.user = checkout._id.user;
                                entry.created = new Date(entry.created);
                                entry.checkboxes = {};
                                setCheckboxes(entry);
                                var supplier = suppliers[entry.supplierId];
                                if (supplier.stock) { supplier.stock.push(entry); }
                                else { supplier.stock = [entry]; }
                            });
//                        }
                    });
		        })
		        .then(function() { $scope.suppliers = rval; })
		        .catch(function(err) { $scope.error = err.data.message; });
		};
	}
]);
