'use strict';

var sticky = angular.module( 'sticky-header', ['ngAnimate', 'mgcrea.ngStrap'] );

sticky.controller('sticky.controller', ['$scope', '$affix', function( $scope, $affix ) {
							$scope.$affix = $affix;
						  }
		 ]
);
 

