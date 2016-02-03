'use strict';

angular.module('atacamaApp').directive('atacamaOhlc',
    ['dataService',
    function (dataService) {
        return {
            templateUrl: 'views/widgets/ohlc.html',
            link: function (scope, element, attrs) {
                //set to null by default so images will not try to load until the data is returned
                scope.selectedLocation = null;
                scope.isLoaded = false;
                scope.hasError = false;
                scope.offsetParent = element.offsetParent();
            }
        };
    }]);
