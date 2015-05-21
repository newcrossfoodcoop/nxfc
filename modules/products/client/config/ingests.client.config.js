'use strict';

// Configuring permissions for Products
angular.module('products').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['ingests'],
        permissions: ['*']
    }]);
}]);

// Configuring the Articles module
angular.module('products').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('ingests', 'menu')) { return; }

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'List Ingests',
			state: 'ingests.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'Create Ingest',
			state: 'ingests.create'
		});
	}
]);
