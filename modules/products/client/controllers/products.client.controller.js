'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Products',
	function($scope, $stateParams, $location, Authorisation, Products ) {
		$scope.authorisation = Authorisation;

		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = new Products ({
				name: this.name
			});

			// Redirect after save
			product.$save(function(response) {
				$location.path('products/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Product
		$scope.remove = function( product ) {
			if ( product ) { product.$remove();

				for (var i in $scope.products ) {
					if ($scope.products [i] === product ) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			var product = $scope.product ;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({ 
				productId: $stateParams.productId
			});
		};
	}
]);
