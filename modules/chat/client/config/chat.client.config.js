'use strict';

// Configuring permissions for Users
angular.module('chat').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['disabled'],
        resources: ['chat'],
        permissions: ['*']
    }]);
}]);

// Configuring the Chat module
angular.module('chat').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('chat', 'menu')) { return; }
	    
		// Set top bar menu items
		Menus.addMenuItem('topbar', {
			title: 'Chat',
			state: 'chat'
		});
	}
]);
