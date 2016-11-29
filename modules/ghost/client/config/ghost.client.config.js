'use strict';

// Configuring permissions for Users
angular.module('ghost').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin', 'ghost-admin', 'ghost-editor', 'ghost-author'],
        resources: ['ghost'],
        permissions: ['*']
    }]);
}]);

// Configuring the Ghost module
angular.module('ghost').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
//	    if (!Authorisation.isAllowed('ghost', 'menu')) { return; }
	
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Content',
			state: 'ghost.admin',
			roles: ['admin', 'ghost-admin', 'ghost-editor', 'ghost-author']
//			state: 'ghost',
//			type: 'dropdown'
		});

		// Add the dropdown list item
//		Menus.addSubMenuItem('topbar', 'ghost', {
//			title: 'Preview',
//			state: 'ghost.preview'
//		});

		// Add the dropdown create item
//		Menus.addSubMenuItem('topbar', 'ghost', {
//			title: 'Admin',
//			state: 'ghost.admin'
//		});
	}
]).config( 
    function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('');
    }
);
