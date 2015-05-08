'use strict';

// Configuring permissions for Articles
angular.module('articles').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['disabled'],
        resources: ['articles'],
        permissions: ['*']
    }]);
}]);

// Configuring the Articles module
angular.module('articles').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
	    if (!Authorisation.isAllowed('articles', 'menu')) { return; }
	
		// Add the articles dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Articles',
			state: 'articles',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'List Articles',
			state: 'articles.list'
		});

		// Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'Create Articles',
			state: 'articles.create'
		});
	}
]);
