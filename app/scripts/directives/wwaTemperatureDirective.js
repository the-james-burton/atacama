(function() {

  'use strict';

  angular.module('atacamaApp').directive('wwaTemperature', ['dataService',
    function(dataService) {
      return {
        templateUrl: 'views/partials/wwaTemperatureTemplate.html',
        link: function(scope, el, attrs) {
          //set to null by default so images will not try to load until the data is returned
          scope.selectedLocation = null;
          scope.isLoaded = false;
          scope.hasError = false;

          scope.loadLocation = function() {
            scope.hasError = false;
            dataService.getLocation(scope.item.widgetSettings.id)
              .then(function(data) {
                scope.selectedLocation = data;
                scope.isLoaded = true;
                scope.isError = false;
              }, function(data) {
                //error
                scope.hasError = true;
              });
          };

          scope.loadLocation();
        }
      };
    }
  ]);

})();
