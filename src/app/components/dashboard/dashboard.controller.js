(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:DashboardController
   * @description
   * # DashboardController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('DashboardController', DashboardController);

  function DashboardController($scope, $localStorage) {
    var vm = this;

    vm.title = 'Dashboard';

    vm.gridsterOpts = {
      columns: 12,
      margins: [20, 20],
      outerMargin: false,
      pushing: true,
      floating: true,
      swapping: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true,
        handles: ['s', 'se', 'sw']
      },
      mobileBreakPoint: 600
    };

    vm.widgetDefinitions = [{
      title: 'OHLC',
      settings: {
        sizeX: 5,
        sizeY: 2,
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
        sizeX: 3,
        sizeY: 2,
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
        sizeX: 3,
        sizeY: 2,
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
        sizeX: 3,
        sizeY: 2,
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
    vm.widgets = $localStorage.widgets || [];

    $scope.$watch('widgets', function () {
      $localStorage.widgets = vm.widgets;
    }, true);

    vm.addNewWidget = function (widget) {
      //deep copy widget settings to be used in new widget
      var newWidget = angular.copy(widget.settings);
      //add new widget to array
      vm.widgets.push(newWidget);
    };

  }

})();
