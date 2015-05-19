'use strict';

// Configuring directives for the Ghost module
angular.module('ecom').directive('addToBasket', ['Basket', function(Basket) {
    return {
        controller: function ($scope) { 
            $scope.addProduct = Basket.addProduct;
        },
        template: '<a class="btn btn-primary" ng-click="addProduct(product);">Add To Basket</a>'
    };
}]);
