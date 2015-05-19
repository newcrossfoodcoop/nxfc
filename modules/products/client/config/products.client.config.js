'use strict';

// Configuring permissions for Products
angular.module('products').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['products'],
        permissions: ['*']
    }]);
}]);

// Configuring the Articles module
angular.module('products').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('products', 'menu')) { return; }

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'List Products',
			state: 'products.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'Create Product',
			state: 'products.create'
		});
	}
]);
