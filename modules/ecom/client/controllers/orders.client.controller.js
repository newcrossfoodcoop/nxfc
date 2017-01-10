'use strict';

// Orders controller
angular.module('ecom').controller('OrdersController', [
    '$scope', '$stateParams', '$location', 'Authorisation', 'Orders', '$state', 'Checkout', 'Authentication',
	function($scope, $stateParams, $location, Authorisation, Orders, $state, Checkout, Authentication) {
		$scope.Authorisation = Authorisation;

		// Remove existing Order
		$scope.remove = function( order ) {
			if ( order ) { order.$remove();

				for (var i in $scope.orders ) {
					if ($scope.orders [i] === order ) {
						$scope.orders.splice(i, 1);
					}
				}
			} else {
				$scope.order.$remove(function() {
					$location.path('orders');
				});
			}
		};

		// Update existing Order
		$scope.update = function() {
			var order = $scope.order ;

			order.$update(function() {
				$location.path('orders/' + order._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Orders
		$scope.find = function() {
			$scope.orders = Orders.query();
		};

		// Find existing Order
		$scope.findOne = function() {
			$scope.order = Orders.get({ 
				orderId: $stateParams.orderId
			});
		};
		
		$scope.getOrderHistory = function() {
			$scope.history = Orders.history({ 
				userId: Authentication.user._id
			})
			.$promise
			.then(function(history) { 
			    $scope.history = history;
			    if (history.length > 0) {
			        $scope.active = history[0].id;
			    } 
			})
			.catch(function(err) { $scope.error = err.data.message; });
		};
		
		$scope.recalculate = function() {
		    var order = $scope.order;
		    
		    order
		        .$recalculate()
		        .then(function(doc) { $scope.order = doc; })
		        .catch(function(err) { $scope.error = err.data.message; });
		};
		
		$scope.recalculateWithLookup = function() {
		    var order = $scope.order;
		    
		    order
		        .$recalculateWithLookup()
		        .then(function(doc) { $scope.order = doc; })
		        .catch(function(err) { $scope.error = err.data.message; });
		};
		
		$scope.close = function() {
		    var order = $scope.order;
		    
		    Checkout
		        .close({ orderId: order._id, method: order.payments[0].method })
		        .$promise
		        .then(function(doc) { $scope.order = doc; })
		        .catch(function(err) { $scope.error = err.data.message; });
		};
		
	}
])
.directive('orderItems', function() {
    return {
        templateUrl: 'modules/ecom/templates/order-items.client.template.html'
    };
})
.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});
