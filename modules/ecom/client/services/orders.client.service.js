'use strict';

//Orders service used to communicate Orders REST endpoints
angular.module('ecom').factory('Orders', ['$resource', 'lodash',
	function($resource, lodash) {
		var Order = $resource('/api/orders/:orderId', 
		    { 
		        orderId: '@_id'
		    }, 
		    {
			    update: {
				    method: 'PUT'
			    }
		    }
		);
		
		Order.prototype.totalItems = function() {
		    var order = this;
            return lodash(order.items)
                .map(function(item) { return item.quantity; })
                .reduce(function(tot,subtot) { return tot + subtot; }, 0);
		};
		
		return Order;
	}
]);
