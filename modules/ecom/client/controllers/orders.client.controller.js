'use strict';

// Orders controller
angular.module('ecom').controller('OrdersController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Orders', '$state',
	function($scope, $stateParams, $location, Authorisation, Orders, $state) {
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
