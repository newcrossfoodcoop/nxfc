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
		    $scope.currentPage = $scope.currentPage || 1;
		    $scope.itemsPerPage = $scope.itemsPerPage || 20;
		    $scope.maxSize = $scope.maxSize || 5;
			$scope.pageChanged();
			Products.count(function(res) { $scope.totalItems = res.count; });
			Products.tags(function(tags) {
			    var aheads = tags;
			    $scope.tags = tags; 
			    Products.supplierCodes(function(supplierCodes) { 
			        $scope.supplierCodes = supplierCodes;
			        aheads = aheads.concat(supplierCodes);
			        Products.brands(function(brands) { 
			            $scope.brands = brands;
			            aheads = aheads.concat(brands);
			            $scope.aheads = aheads;
			        });
			    });
			});

		};
		
		$scope.pageChanged = function() {
		    $scope.products = Products.query({
		        pagenumber: $scope.currentPage,
		        textsearch: $scope.searchTerms,
			    itemsperpage: $scope.itemsPerPage
		    });
		};
		
		$scope.doSearch = function(searchTerms) {
		    if (searchTerms) {
		        $scope.searchTerms = searchTerms;
		    }
		    $scope.currentPage = 1;
		    Products.count(
		        {textsearch: $scope.searchTerms}, 
		        function(res) { 
		            $scope.totalItems = res.count; 
		        }
		    );
		    $scope.pageChanged();
		};
		
		$scope.setItemsPerPage = function(itemsPerPage) {
		    $scope.itemsPerPage = itemsPerPage;
		    $scope.doSearch();
		};

		// Find existing Product
		$scope.findOne = function() {
			$scope.product = Products.get({ 
				productId: $stateParams.productId
			});
		};
		
	}
]);
