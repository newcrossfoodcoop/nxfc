'use strict';

// Configuring permissions for Products
angular.module('ecom').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['orders'],
        permissions: ['*']
    }]);
}]);

// Configuring the Orders module
angular.module('ecom').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('ecom', 'menu')) { return; }
	
		// Add the orders dropdown item
		Menus.addMenuItem('topbar', {
			title: 'ECom',
			state: 'ecom',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'List Orders',
			state: 'orders.list'
		});
		
	}
]);
