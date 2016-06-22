'use strict';

// Configuring permissions for suppliers
angular.module('ecom').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['suppliers'],
        permissions: ['*']
    }]);
}]);

// Configuring the Articles module
angular.module('ecom').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('suppliers', 'menu')) { return; }

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'Suppliers',
			state: 'suppliers.list'
		});

	}
]);
