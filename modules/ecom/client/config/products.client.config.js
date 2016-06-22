'use strict';

// Configuring permissions for Products
angular.module('ecom').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['products'],
        permissions: ['*']
    }]);
}]);

// Configuring the Articles module
angular.module('ecom').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('products', 'menu')) { return; }

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'Products',
			state: 'products.list'
		});

	}
]);
