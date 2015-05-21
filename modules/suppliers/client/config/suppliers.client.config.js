'use strict';

// Configuring permissions for suppliers
angular.module('suppliers').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['suppliers'],
        permissions: ['*']
    }]);
}]);

// Configuring the Articles module
angular.module('suppliers').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('suppliers', 'menu')) { return; }

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'List Suppliers',
			state: 'suppliers.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'Create Supplier',
			state: 'suppliers.create'
		});
	}
]);
