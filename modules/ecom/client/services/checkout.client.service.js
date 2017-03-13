'use strict';

//Checkout service used to communicate Checkout REST endpoints
angular.module('ecom').factory('Checkout', ['$resource', 'lodash',
	function($resource, lodash) {
		var Checkout = $resource('/api/checkout', 
		    { 
		        orderId: '@_id',
		        method: '@method',
		        token: '@token'
		    }, 
		    {
		        start: {
		            method: 'POST',
		            url: '/api/checkout/:method'
		        },
		        confirm: {
		            method: 'GET',
		            url: '/api/checkout/:method/:orderId/:token/confirm'
		        },
		        cancelled: {
		            method: 'PUT',
		            url: '/api/checkout/:method/:orderId/:token/cancelled'
		        },
		        redirected: {
		            method: 'PUT',
		            url: '/api/checkout/:method/:orderId/:token/redirected'
		        },
		        config: {
		            method: 'GET',
		            url: '/api/checkout/config'
		        },
		        close: {
		            method: 'GET',
		            url: '/api/checkout/:method/:orderId/close'
		        }
		    }
		);
		
		
		Checkout.prototype.totalItems = function() {
		    var order = this;
            return lodash(order.items)
                .map(function(item) { return item.quantity; })
                .reduce(function(tot,subtot) { return tot + subtot; }, 0);
		};
		
		return {
		    start: function(items, method, pickup, total, callback) {
		        if (!pickup || pickup.state !== 'open') {
		            return callback(new Error('There is no open collection window to order against, notification will be sent by email when a new one opens'));
		        }
		    
		        var checkout = new Checkout({
		            items: items,
		            state: 'new',
		            method: method,
		            pickupId: pickup._id,
		            total: total 
		        });
		        
		        if (checkout.items.length === 0) { return; }

		        // Redirect after save
	            checkout.$start(
	                function(response) { callback(null,response); }, 
	                callback
	            );  
		    },
		    get: Checkout.get,
		    cancelled: Checkout.cancelled,
		    redirected: Checkout.redirected,
		    config: Checkout.config,
		    close: Checkout.close
		};
	}
]);
