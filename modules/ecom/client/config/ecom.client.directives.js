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

angular.module('ecom').directive('ngPrint', function() {

    var printSection = document.getElementById('printSection');

    // if there is no printing section, create one
    if (!printSection) {
        printSection = document.createElement('div');
        printSection.id = 'printSection';
        printSection.class = 'printSection';
        document.body.appendChild(printSection);
    }

    function afterPrint() {
        // clean the print section before adding new content
        printSection.innerHTML = '';
    }
    
    function beforePrint() {}

    function printElement(elem) {
        // clones the element you want to print
        var domClone = elem.cloneNode(true);
        printSection.innerHTML = '';
        printSection.appendChild(domClone);
        window.print();
    }

    function link(scope, element, attrs) {
        element.on('click', function () {
            var elemToPrint = document.getElementById(attrs.printElementId);
            if (elemToPrint) {
                scope.ngPrinting = true;
                scope.$apply();
                printElement(elemToPrint);
                scope.ngPrinting = false;
                scope.$apply();
            }
        });

        if (window.matchMedia) {
            var mediaQueryList = window.matchMedia('print');
            mediaQueryList.addListener(function(mql) {
                if (!mql.matches) {
                    afterPrint();
                } else {
                    beforePrint();
                }
            });
        }

        window.onafterprint = afterPrint;
    }

    return {
        link: link,
        restrict: 'A'
    };
    
});
