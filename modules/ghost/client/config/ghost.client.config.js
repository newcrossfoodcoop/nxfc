'use strict';

// Configuring the Ghost module
angular.module('ghost').run(['Menus',
	function(Menus) {
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Ghost',
			state: 'ghost',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'ghost', {
			title: 'Preview',
			state: 'ghost.preview'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'ghost', {
			title: 'Admin',
			state: 'ghost.admin'
		});
	}
]).config( 
    function(localStorageServiceProvider) {
        localStorageServiceProvider.setPrefix('');
    }
);
