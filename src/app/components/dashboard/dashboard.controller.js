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

    vm.customItemMap = {
      sizeX: 'item.settings.sizeX',
      sizeY: 'item.settings.sizeY',
      row: 'item.settings.row',
      col: 'item.settings.col',
      minSizeY: 'item.settings.minSizeY',
      maxSizeY: 'item.settings.maxSizeY'
    };

    vm.widgetDefinitions = [{
      title: 'OHLC',
      settings: {
        sizeX: 6,
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
        sizeX: 6,
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
        sizeX: 6,
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
        sizeX: 6,
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

    // list of available dashboards...
    // TODO make user configurable...
    vm.defaultDashboards = {
      '1': {
        id: '1',
        name: 'one',
        widgets: []
      },
      '2': {
        id: '2',
        name: 'two',
        widgets: []
      }
    };

    // check localstorage for saved dashboards, or use default...
    vm.dashboards = $localStorage.dashboards || vm.defaultDashboards;

    // auto sync local storage with our list of dashboards...
    $scope.$watch('dashboards', function () {
      $localStorage.dashboards = vm.dashboards;
    }, true);

    // use this when using a HTML 'select' element and ng-model...
    // $scope.$watch('selectedDashboardId', function (newVal, oldVal) {
    //   if (newVal !== oldVal) {
    //     vm.dashboard = vm.dashboards[newVal];
    //   } else {
    //     vm.dashboard = vm.dashboards[1];
    //   }
    // });

    // use this when using uib-dropdown with 'ng-click' method (can't bind)...
    vm.selectDashboard = function (id) {
      vm.dashboard = vm.dashboards[id];
    };

    // select an initial dashboard for the user...
    // TODO load from local storage...
    // vm.selectedDashboardId = 1;
    vm.selectDashboard(1);

    vm.addNewWidget = function (widget) {
      //deep copy widget settings to be used in new widget
      var newWidget = angular.copy(widget);
      //add new widget to array
      vm.dashboard.widgets.push(newWidget);
    };

    vm.removeWidget = function (widget) {
      vm.dashboard.widgets.splice(vm.dashboard.widgets.indexOf(widget), 1);
    };
  }

})();
