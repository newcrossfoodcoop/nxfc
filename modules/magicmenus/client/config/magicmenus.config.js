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

		// Add submenus
		Menus.addSubMenuItem('magicmenu', 'how', {
			title: 's1',
			state: 'how.s1'
		});

		Menus.addSubMenuItem('magicmenu', 'how', {
			title: 's2',
			state: 'how.s2'
		});

		Menus.addSubMenuItem('magicmenu', 'how', {
			title: 's3',
			state: 'how.s3'
		});

		Menus.addSubMenuItem('magicmenu', 'about', {
			title: 's1',
			state: 'about.s1'
		});

		Menus.addSubMenuItem('magicmenu', 'about', {
			title: 's2',
			state: 'about.s2'
		});

		Menus.addSubMenuItem('magicmenu', 'about', {
			title: 's3',
			state: 'about.s3'
		});

		Menus.addSubMenuItem('magicmenu', 'communities', {
			title: 's1',
			state: 'communities.s1'
		});

		Menus.addSubMenuItem('magicmenu', 'communities', {
			title: 's2',
			state: 'communities.s2'
		});

		Menus.addSubMenuItem('magicmenu', 'communities', {
			title: 's3',
			state: 'communities.s3'
		});

		Menus.addSubMenuItem('magicmenu', 'recipes', {
			title: 's1',
			state: 'recipes.s1'
		});

		Menus.addSubMenuItem('magicmenu', 'recipes', {
			title: 's2',
			state: 'recipes.s2'
		});

		Menus.addSubMenuItem('magicmenu', 'recipes', {
			title: 's3',
			state: 'recipes.s3'
		});

		Menus.addSubMenuItem('magicmenu', 'shop', {
			title: 's1',
			state: 'shop.s1'
		});

		Menus.addSubMenuItem('magicmenu', 'shop', {
			title: 's2',
			state: 'shop.s2'
		});

		Menus.addSubMenuItem('magicmenu', 'shop', {
			title: 's3',
			state: 'shop.s3'
		});

		     }
]);
							   
