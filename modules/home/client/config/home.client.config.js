'use strict';

var menus = angular.module( 'home' );				

menus.run([ 'Menus', function( Menus ) {

	//Adding magic menu
    Menus.addMenu('magicmenu', {
        isPublic: true
    });

	// Add the dropdown menus
	Menus.addMenuItem('magicmenu', {
		title: 'Home',
		state: 'home.home'
	});

	Menus.addMenuItem('magicmenu', {
		title: 'How It Works',
		state: 'home.how'
	});

	Menus.addMenuItem('magicmenu', {
		title: 'About',
		state: 'home.about',
	});

	Menus.addMenuItem('magicmenu', {
		title: 'Communities',
		state: 'home.communities',
	});

	Menus.addMenuItem('magicmenu', {
		title: 'Recipes',
		state: 'home.recipes',
	});

	Menus.addMenuItem('magicmenu', {
		title: 'Shop Now',
		state: 'home.shop',
	});

}]);
