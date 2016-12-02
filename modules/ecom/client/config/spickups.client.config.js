'use strict';

var menus = angular.module( 'ecom' );				

menus.run([ 'Menus', function( Menus ) {

	//Adding magic menu
    Menus.addMenu('pickupmenu', {
        roles: ['manager']
    });

	Menus.addMenuItem('pickupmenu', {
		title: 'Actions',
		state: 'vpickups.actions',
		roles: ['manager']
	});
	
	Menus.addMenuItem('pickupmenu', {
		title: 'Baskets By User',
		state: 'vpickups.checkouts',
		roles: ['manager']
	});
	
	Menus.addMenuItem('pickupmenu', {
		title: 'Items By Supplier',
		state: 'vpickups.orders',
		roles: ['manager']
	});

//	Menus.addSubMenuItem('pickupmenu', 'apickups', {
//		title: 'Action',
//		state: 'vpickups.action',
//		roles: ['manager']
//	});

//	Menus.addSubMenuItem('pickupmenu', 'vpickup', {
//		title: 'Products',
//		state: 'vpickup.products',
//		roles: ['admin', 'manager']
//	});

//	Menus.addSubMenuItem('pickupmenu', 'vpickup', {
//		title: 'Orders',
//		state: 'vpickup.orders',
//		roles: ['admin', 'manager']
//	});

//	Menus.addSubMenuItem('pickupmenu', 'apickup', {
//		title: 'Create Supplier Orders',
//		state: 'apickup.orders',
//		roles: ['admin', 'manager']
//	});

//	Menus.addSubMenuItem('pickupmenu', 'apickup', {
//		title: 'Create Pick List',
//		state: 'apickup.picklists',
//		roles: ['admin', 'manager']
//	});

}]);
