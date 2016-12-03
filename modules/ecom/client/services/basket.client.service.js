'use strict';

angular.module('ecom').factory('Basket', [ 'localStorageService', 'Authentication', 'lodash',
	function(localStorageService, Authentication, lodash) {

		// Basket service logic
		if (!localStorageService.get('basketItems')) {
		    localStorageService.set('basketItems',[]);
		}

		// Public API
		return {
		    addItem: function(item, quantity) {
		        quantity = quantity ? quantity : 1;
		        
		        // increase quantity of item
		        var items = localStorageService.get('basketItems');
		        var index = lodash.findIndex(items, {_product: item._product});
		        if (index >= 0) {
		            items[index].quantity += quantity;
		            localStorageService.set('basketItems',items);
		        }
		    },
			addProduct: function(product, quantity) {
			    quantity = quantity ? quantity : 1;
			    
			    // increase quantity or insert new item
			    var items = localStorageService.get('basketItems');
			    var item = lodash.find(
			        items, 
			        function(i) { return i._product === product._id; }
			    );
			    
			    if (item) {
			        item.quantity += quantity;
			    }
			    else {
				    items.push({
				        _product: product._id,
				        name: product.name,
				        price: product.price,
				        quantity: quantity,
				        size: product.size
				    });
				}
				
				localStorageService.set('basketItems',items);
			},
			removeItem: function(item, quantity) {
                quantity = quantity ? quantity : 1;
                
                // decrease quantity or remove item
                var items = localStorageService.get('basketItems');
			    var index = lodash.findIndex(items, {_product: item._product});
			    if (items[index].quantity > quantity) {
			        items[index].quantity -= quantity;
			    }
			    else {
			        items.splice(index, 1);
			    }
			    localStorageService.set('basketItems',items);
			},
			bindItems: function($scope) {
			    return localStorageService.bind($scope, 'basketItems');
			},
			orderItems: function() {
			    var items = localStorageService.get('basketItems');
			    return lodash.map(items, function(item) {
			        return { _product: item._product, quantity: item.quantity };
			    });
			},
			totalItems: function() {
			    var items = localStorageService.get('basketItems');
			    return lodash.reduce(items, function(total, item) {
			        return total + item.quantity;
			    },0);
			},
			clear: function() {
			    var items = localStorageService.get('basketItems');
			    // remove the contents leaving the array reference intact...
			    items.splice(0, items.length);
			    localStorageService.set('basketItems',items);
			},
			total: function() {
			    var items = localStorageService.get('basketItems');
			    var final = lodash.reduce(items, function(total, item) { 
			        return item.price ? total + item.price * item.quantity : total;
			    }, 0);
			    return final.toFixed(2);
			}
		};
	}
]);
