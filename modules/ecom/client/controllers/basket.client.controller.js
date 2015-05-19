'use strict';

angular.module('ecom').controller('BasketController', 
    ['$scope', 'Basket', '$location', 'Authentication', 'Orders', 'usSpinnerService', 'Checkout', 'lodash',
	function($scope, Basket, $location, Authentication, Orders, usSpinnerService, Checkout, lodash) {
	
		// Basket controller logic
		
		$scope.startCheckout = function(method) {
            usSpinnerService.spin('spinner-1');
            
            Checkout.start(Basket.orderItems(), method, function(err, response) {
                if (err) {
                    $scope.error = err.data.message;
                }
                else {
                    window.location.href = response.redirect;
                }
            });
		};
		
		Basket.bindItems($scope);
		
		$scope.total = Basket.total;
		
		$scope.clear = function() {
		    var items = $scope.basketItems;
		    // remove the contents leaving the array reference intact...
		    items.splice(0, items.length);
		};
		
		$scope.addItem = function(item, quantity) {
	        quantity = quantity ? quantity : 1;
	        
	        // increase quantity of item
	        var items = $scope.basketItems;
	        var index = lodash.findIndex(items, {_product: item._product});
	        if (index >= 0) {
	            items[index].quantity += quantity;
	        }
	    };
		
		$scope.removeItem = function(item, quantity) {
            quantity = quantity ? quantity : 1;
            
            // decrease quantity or remove item
            var items = $scope.basketItems;
		    var index = lodash.findIndex(items, {_product: item._product});
		    if (items[index].quantity > quantity) {
		        items[index].quantity -= quantity;
		    }
		    else {
		        items.splice(index, 1);
		    }
		};
		
		$scope.totalItems = Basket.totalItems;
		
	}
]);
