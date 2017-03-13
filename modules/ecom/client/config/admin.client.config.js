'use strict';

// Configuring permissions for Products
angular.module('ecom').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin'],
        resources: [
            'orders', 'ingests', 'products', 'suppliers', 'locations', 
            'pickups', 'admin'
        ],
        permissions: ['*']
    },{
        roles: ['manager'],
        resources: ['pickups'],
        permissions: ['menu']
    },{
        roles: ['user'],
        resources: ['orders'],
        permissions: ['history']
    }]);
}]);

// Configuring the Orders module
angular.module('ecom').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    //if (!Authorisation.isAllowed('admin', 'menu')) { return; }
	    
	    // Add the orders dropdown item
	    Menus.addMenuItem('topbar', {
		    title: 'Admin',
		    state: 'ecom',
		    type: 'dropdown',
		    roles: ['admin']
	    });

        //if (Authorisation.isAllowed('orders', 'admin')) {
		    // Add the dropdown list item
		    Menus.addSubMenuItem('topbar', 'ecom', {
			    title: 'Orders',
			    state: 'orders.list',
			    roles: ['admin']
		    });
        //}

	    //if (Authorisation.isAllowed('ingests', 'admin')) {

		    // Add the dropdown list item
		    Menus.addSubMenuItem('topbar', 'ecom', {
			    title: 'Ingests',
			    state: 'ingests.list',
			    roles: ['admin']
		    });

		// Add the dropdown create item
//		Menus.addSubMenuItem('topbar', 'ecom', {
//			title: 'Create Ingest',
//			state: 'ingests.create'
//		});
//        }

	    //if (Authorisation.isAllowed('products', 'admin')) {

		    // Add the dropdown list item
		    Menus.addSubMenuItem('topbar', 'ecom', {
			    title: 'Products',
			    state: 'products.list',
			    roles: ['admin']
		    });
//        }

//	    if (Authorisation.isAllowed('suppliers', 'admin')) {

		    // Add the dropdown list item
		    Menus.addSubMenuItem('topbar', 'ecom', {
			    title: 'Suppliers',
			    state: 'suppliers.list',
			    roles: ['admin']
		    });
//		}

//	    if (Authorisation.isAllowed('locations', 'admin')) {

		    // Add the dropdown list item
		    Menus.addSubMenuItem('topbar', 'ecom', {
			    title: 'Locations',
			    state: 'locations.list',
			    roles: ['admin']
		    });
//        }

//	    if (Authorisation.isAllowed('pickups', 'admin')) {

		    // Add the dropdown list item
		    Menus.addSubMenuItem('topbar', 'ecom', {
			    title: 'Pickups',
			    state: 'pickups.list',
			    roles: ['admin']
		    });
//		}
	}
]);
