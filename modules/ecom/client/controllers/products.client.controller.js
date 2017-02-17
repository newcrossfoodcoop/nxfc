'use strict';

// Products controller
angular.module('ecom').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authorisation', 'Products', 'lodash',
	function($scope, $stateParams, $location, Authorisation, Products, lodash ) {
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

		function makeQuery() {
		    var query = {};
		    
		    if ($scope.searchTerms) {
		        query.textsearch = $scope.searchTerms;
		    }
		    
		    var tags = lodash($scope.tagset)
		        .pairs()
		        .map(function(pair) { return pair[1] ? pair[0] : null; })
		        .filter()
		        .valueOf();
		        
		    if (tags.length > 0) {
		        query.tags = tags;
		    }
		    
		    var categories = lodash($scope.categoryset)
		        .pairs()
		        .map(function(pair) { return pair[1] ? pair[0] : null; })
		        .filter()
		        .valueOf();
		    
		    if (categories.length > 0) {
		        query.categories = categories;
		    }
		    
		    return query;
		}
				
		function pageChanged() {
		    var query = makeQuery();
		    
		    Products.count(query).$promise
		        .then(function(res) { 
			        $scope.totalItems = res.count;
			        query.pagenumber = $scope.currentPage;
			        query.itemsperpage = $scope.itemsPerPage;
			        return Products.query(query).$promise;
			    })
			    .then(function(products) {
			        $scope.products = products;
			    });
		}
		
		function pageChangedAll() {
		    var query = makeQuery();
		    
		    Products.count(query).$promise
		        .then(function(res) { 
			        $scope.totalItems = res.count;
			        query.pagenumber = $scope.currentPage;
			        query.itemsperpage = $scope.itemsPerPage;
			        return Products.all(query).$promise;
			    })
			    .then(function(products) {
			        $scope.products = products;
			    });
		}

		// Find a list of Products
		$scope.find = function() {
		    $scope.currentPage = $scope.currentPage || 1;
		    $scope.itemsPerPage = $scope.itemsPerPage || 20;
		    $scope.maxSize = $scope.maxSize || 5;
		    $scope.pageChanged = pageChanged;
		    $scope.tagset = {};
		    $scope.categoryset = {};
			$scope.pageChanged();
			$scope.refreshTags();
		};
		
		$scope.findAll = function() {
		    $scope.currentPage = $scope.currentPage || 1;
		    $scope.itemsPerPage = $scope.itemsPerPage || 20;
		    $scope.maxSize = $scope.maxSize || 5;
		    $scope.pageChanged = pageChangedAll;
		    $scope.tagset = {};
		    $scope.categoryset = {};
			$scope.pageChanged();
			$scope.refreshTags();
		};
		
		$scope.refreshTags = function() { 
			var aheads = null;
			Products.tags().$promise
			    .then(function(tags) {
			        aheads = tags;
			        $scope.tags = tags; 
			        return Products.supplierCodes().$promise;
			     })
		        .then(function(supplierCodes) { 
		            $scope.supplierCodes = supplierCodes;
		            aheads = aheads.concat(supplierCodes);
		            return Products.brands().$promise;
		        })
		        .then(function(brands) { 
		            $scope.brands = brands;
		            aheads = aheads.concat(brands);
		            $scope.aheads = aheads;
		        });
		        
		    Products.categories().$promise
		        .then(function(categories) {
		            $scope.categories = categories;
		        });
		};
		
		$scope.doSearch = function(searchTerms) {
		    if (searchTerms) {
		        $scope.searchTerms = searchTerms;
		    }
		    $scope.currentPage = 1;
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
