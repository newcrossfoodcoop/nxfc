'use strict';

// Configuring permissions for Products
angular.module('ecom').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin','manager'],
        resources: ['spickups'],
        permissions: ['menu']
    }]);
}]);

// Configuring the Orders module
angular.module('ecom').run(['Menus', 'Authorisation', 'Pickups', 'lodash', 
	function(Menus, Authorisation, Pickups, lodash) {
	    
	    // Add the orders dropdown item
	    Menus.addMenuItem('topbar', {
		    title: 'Pickups',
		    state: 'spickups',
		    type: 'dropdown',
		    roles: ['admin', 'manager']
	    });

        var pickups = Pickups.query({}, function(pickups) {
            lodash.each(pickups, function(pickup) {
                // TODO get current pickups and create a menu item for each one
	            // Add the dropdown list item
	            Menus.addSubMenuItem('topbar', 'spickups', {
		            title: pickup.location.name +' - '+ pickup.start,
		            state: 'vpickups.actions({spickupId: "'+pickup._id+'"})',
//		            state: 'vpickups.view',
		            roles: ['admin', 'manager']
	            });
	        }); 
        });
    }
]);
