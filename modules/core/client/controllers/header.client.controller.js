'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
	function($scope, $state, Authentication, Menus) {
		// Expose view variables
		$scope.$state = $state;
		$scope.authentication = Authentication;

		
var keys = [];
for (var key in Menus.menus){
    keys.push(key);
}
console.log(Menus.menus[keys[0]]);
console.log(Menus.menus[keys[1]]);

		//Redesign
		if ( Menus.count === undefined ) {
			Menus.count = 0;
		}
		
		console.log( Menus.count );

		// Get the menu
		$scope.menu = Menus.menus[keys[Menus.count]];

		//increment count
		Menus.count += 1;


		// Toggle the menu items
		$scope.isCollapsed = false;
		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);


