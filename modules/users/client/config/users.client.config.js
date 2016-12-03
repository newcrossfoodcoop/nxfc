'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function ($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function ($q, $location, Authentication) {
				return {
					responseError: function (rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);

// Configuring permissions for Users
angular.module('users').run(['Authorisation', function(Authorisation) {
    Authorisation.allow([{
        roles: ['admin'],
        resources: ['users'],
        permissions: ['*']
    }, {
        roles: ['manager'],
        resources: ['users'],
        permissions: ['list','activate','view']
    }]);
}]);

// Configuring the Articles module
angular.module('users').run(['Menus', 'Authorisation',
	function(Menus, Authorisation) {
//	    if (!Authorisation.isAllowed('users', 'menu')) { return; }
	
		// Add the users dropdown item
		Menus.addMenuItem('topbar', {
			title: 'Users',
			state: 'users',
			roles: ['admin', 'manager'],
//			state: 'users',
			type: 'dropdown'
		});

		// Add the dropdown list item
		Menus.addSubMenuItem('topbar', 'users', {
			title: 'List',
			state: 'users.list',
			roles: ['admin', 'manager']
		});
		
		Menus.addSubMenuItem('topbar', 'users', {
			title: 'Create',
			state: 'users.create',
			roles: ['admin', 'manager']
		});
	}
]);
