(function() {﻿

  'use strict';

  angular.module('atacamaApp').directive('wwaDashboard', ['$localStorage', function($localStorage) {
    return {
      scope: {},
      template: '<ps-dashboard></ps-dashboard>',
      link: function(scope) {

        scope.title = 'Dashboard';

        scope.gridsterOpts = {
          columns: 12,
          margins: [20, 20],
          outerMargin: false,
          pushing: true,
          floating: true,
          swapping: true,
          mobileBreakPoint: 600
        };

        scope.widgetDefinitions = [{
          title: 'Temperature',
          settings: {
            sizeX: 3,
            sizeY: 3,
            minSizeX: 2,
            minSizeY: 2,
            template: '<wwa-temperature></wwa-temperature>',
            widgetSettings: {
              id: 1000,
              templateUrl: 'views/partials/wwaSelectLocationTemplate.html',
              controller: 'wwaSelectLocationController'
            }
          }
        }, {
          title: 'OHLC',
          settings: {
            sizeX: 3,
            sizeY: 3,
            minSizeX: 2,
            minSizeY: 2,
            template: '<atacama-ohlc></atacama-ohlc>',
            widgetSettings: {
              id: 1000,
              templateUrl: 'views/partials/wwaSelectLocationTemplate.html',
              controller: 'wwaSelectLocationController'
            }
          }
        }, {
          title: 'Indicator',
          settings: {
            sizeX: 5,
            sizeY: 3,
            minSizeX: 2,
            minSizeY: 2,
            template: '<atacama-indicator></atacama-indicator>',
            widgetSettings: {
              id: 1002,
              templateUrl: 'views/partials/wwaSelectLocationTemplate.html',
              controller: 'wwaSelectLocationController'
            }
          }
        }, {
          title: 'Strategy',
          settings: {
            sizeX: 5,
            sizeY: 3,
            minSizeX: 2,
            minSizeY: 2,
            template: '<atacama-strategy></atacama-strategy>',
            widgetSettings: {
              id: 5000,
              templateUrl: 'views/partials/wwaSelectLocationTemplate.html',
              controller: 'wwaSelectLocationController'
            }
          }
        }];

        //widgets collection - new widgets get added here
        //check localstorage for saved widgets
        scope.widgets = $localStorage.widgets || [];

        scope.$watch('widgets', function() {
          $localStorage.widgets = scope.widgets;
        }, true);
      }
    };
  }]);

})();
