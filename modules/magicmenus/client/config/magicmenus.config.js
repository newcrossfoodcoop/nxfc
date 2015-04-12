'use strict';

var menus = angular.module( 'magicmenus', [] );				

menus.run([ 'Menus', function( Menus ) {
			
		// Add the dropdown menus
		Menus.addMenuItem('magicmenu', {
			title: 'How It Works',
			state: 'how',
			type: 'dropdown'
		});

		Menus.addMenuItem('magicmenu', {
			title: 'About',
			state: 'about',
			type: 'dropdown'
		});

		Menus.addMenuItem('magicmenu', {
			title: 'Communities',
			state: 'communities',
			type: 'dropdown'
		});

		Menus.addMenuItem('magicmenu', {
			title: 'Recipes',
			state: 'recipes',
			type: 'dropdown'
		});

		Menus.addMenuItem('magicmenu', {
			title: 'Shop Now',
			state: 'shop',
			type: 'dropdown'
		});

		/*  Add the dropdown create item
		Menus.addSubMenuItem('topbar', 'articles', {
			title: 'Create Articles',
			state: 'articles.create'
		}); */
		     }
]);
							   
