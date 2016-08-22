(function () {﻿

  'use strict';

  /** @ngInject */
  angular.module('atacamaApp').directive('atacamaDashboard', function ($localStorage) {
    return {
      scope: {},
      template: '<ps-dashboard></ps-dashboard>',
      link: linkFunc
    };

    function linkFunc(scope) {

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
        title: 'OHLC',
        settings: {
          sizeX: 3,
          sizeY: 3,
          minSizeX: 2,
          minSizeY: 2,
          template: '<atacama-ohlc></atacama-ohlc>',
          widgetSettings: {
            id: 1001,
            templateUrl: 'app/components/widgets/widget.settings.html',
            controller: 'WidgetSettingsController'
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
            templateUrl: 'app/components/widgets/widget.settings.html',
            controller: 'WidgetSettingsController'
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
            id: 1003,
            templateUrl: 'app/components/widgets/widget.settings.html',
            controller: 'WidgetSettingsController'
          }
        }
      }, {
        title: 'Strategy Table',
        settings: {
          sizeX: 5,
          sizeY: 3,
          minSizeX: 2,
          minSizeY: 2,
          template: '<atacama-strategy-table></atacama-strategy-table>',
          widgetSettings: {
            id: 1004,
            templateUrl: 'app/components/widgets/widget.settings.html',
            controller: 'WidgetSettingsController'
          }
        }
      }];

      //widgets collection - new widgets get added here
      //check localstorage for saved widgets
      scope.widgets = $localStorage.widgets || [];

      scope.$watch('widgets', function () {
        $localStorage.widgets = scope.widgets;
      }, true);
    }

  });

})();
