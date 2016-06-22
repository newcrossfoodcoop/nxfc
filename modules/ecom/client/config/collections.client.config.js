'use strict';

// Configuring permissions for collections
angular.module('ecom').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'manager'],
        resources: ['collections'],
        permissions: ['*']
    }]);
}]);

// Configuring the Collections module
angular.module('ecom').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('collections', 'menu')) { return; }

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ecom', {
			title: 'Collections',
			state: 'collections.list'
		});

	}
]);
