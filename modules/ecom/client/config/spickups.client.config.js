'use strict';

var menus = angular.module( 'ecom' );				

menus.run([ 'Menus', function( Menus ) {

	//Adding magic menu
    Menus.addMenu('pickupmenu', {
        roles: ['admin', 'manager']
    });

	// Add the dropdown menus
	Menus.addMenuItem('pickupmenu', {
		title: 'Views',
		state: 'vpickup',
		roles: ['admin', 'manager']
	});

	Menus.addSubMenuItem('pickupmenu', 'vpickup', {
		title: 'Checkouts',
		state: 'vpickup.checkouts',
		roles: ['admin', 'manager']
	});

	Menus.addSubMenuItem('pickupmenu', 'vpickup', {
		title: 'Products',
		state: 'vpickup.products',
		roles: ['admin', 'manager']
	});

	Menus.addSubMenuItem('pickupmenu', 'vpickup', {
		title: 'Orders',
		state: 'vpickup.orders',
		roles: ['admin', 'manager']
	});

	Menus.addMenuItem('pickupmenu', {
		title: 'Actions',
		state: 'apickup',
		dropdown: true,
		roles: ['admin', 'manager']
	});

	Menus.addSubMenuItem('pickupmenu', 'apickup', {
		title: 'Create Supplier Orders',
		state: 'apickup.orders',
		roles: ['admin', 'manager']
	});

	Menus.addSubMenuItem('pickupmenu', 'apickup', {
		title: 'Create Pick List',
		state: 'apickup.picklists',
		roles: ['admin', 'manager']
	});

}]);
