'use strict';

// Orders controller
angular.module('ecom').controller('CheckoutController', ['$scope', '$stateParams', '$location', 'Authentication', '$state',  'usSpinnerService', 'Basket', 'Checkout', 'lodash', '$sce', 'Pickups',
	function($scope, $stateParams, $location, Authentication, $state, usSpinnerService, Basket, Checkout, lodash, $sce, Pickups) {
		$scope.authentication = Authentication;
		
		$scope.$state = $state;
		Basket.bindItems($scope);
		
		$scope.total = Basket.total;
		
		Pickups.open().$promise.then(function(pickups) { $scope.pickup = pickups[0]; });
		
		// we will store all of our form data in this object
	    $scope.formData = {};
	    
	    function startCheckout(method) {
            usSpinnerService.spin('spinner-1');
            
            Checkout.start(Basket.orderItems(), method, $scope.pickup, Basket.total(), function(err, response) {
                if (err) {
                    $scope.error = err.data.message;
                }
                else {
                    window.location.href = response.redirect;
                }
            });
		}
	    
	    var stepDfn = {
	        complete: {
	            profile: function() { return !!($scope.formData.profile); },
	            delivery: function() { return !!($scope.formData.delivery); },
	            payment: function() { return !!($scope.formData.psp); }
	        },
	        _states: ['profile','delivery','payment']
	    };
	    
	    // function to process the form
	    $scope.processForm = function() {
		    var complete = lodash.filter(stepDfn._states, function(state) {
		        return stepDfn.complete[state]();
		    });
		    
		    if (complete.length === stepDfn._states.length) {
		        startCheckout($scope.formData.psp);
		    }
		    else {
		        var rejected = lodash.reject(stepDfn._states, function(state) {
		            return stepDfn.complete[state]();
		        });
		        
		        $state.go('checkout.' + rejected[0]);
		    }
	    };
	    
	    $scope.getStepState = function getStepState (stateName) {
	        if ($state.includes('checkout.' + stateName)) {
	            return 'active';
	        }
	        
	        var index = stepDfn._states.indexOf(stateName);
	        
	        if (stepDfn.complete[stateName]) {
	            var activeIndex = lodash.findIndex(stepDfn._states, function(state) {
	                return $state.includes('checkout.' + state);
	            });
	            
	            if (index <= activeIndex) {
	                return 'complete';
	            }
	        }
	        
	        if (index > 0  && stepDfn._states[index - 1] && stepDfn.complete[stepDfn._states[index - 1]]()) {
	            return 'ready';
	        }
	        else if (index === 0) {
	            return 'ready';
	        }
	        
	        return 'disabled';
	    };
		
		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Checkout.get({ 
				orderId: $stateParams.orderId
			});
		};
		
		$scope.config = Checkout.config();
		
		$scope.confirmOrder = function() {
		    usSpinnerService.spin('spinner-1');
		    var order = $scope.order;
		    var orderId = order._id;
		    order.$confirm(
		        { method: $stateParams.method, token: $stateParams.token },
		        function() {
		            Basket.clear();
		            $state.go('confirmedOrder', { 'orderId': orderId }); 
		        },
		        function(errorResponse) {
		            $scope.error = errorResponse.data.message;
		        }
		    );
		};
		
		// Redirection back from paypal
		$scope.redirected = function() {
		    Checkout.redirected(
		        { orderId: $stateParams.orderId, method: $stateParams.method }, 
		        { token: $stateParams.token, PayerID: $stateParams.PayerID },
		        function(data) {
		            $scope.order = data;
		            $scope.confirmOrder();
		        },
		        function(errorResponse) {
		            $scope.error = errorResponse.data.message;
		        }
 		    );
		};
		
		$scope.cancelled = function() {
		    Checkout.cancelled(
		        { orderId: $stateParams.orderId, method: $stateParams.method },
		        { token: $stateParams.token },
		        function() { console.log('cancelled');},
		        function(errorResponse) {
		            $scope.error = errorResponse.data.message;
		        }
		    );
		    
		};

	}
]);
