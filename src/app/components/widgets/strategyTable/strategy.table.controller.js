(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:StrategyTableController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('StrategyTableController', StrategyTableController);

  function StrategyTableController(
    $scope, ngstomp, $resource, $log, Restangular,
    elasticsearchService, chartService, turbineService, utilService, widgetService) {
    var vm = this;

    // adjustments to make the chart fit better in the widget...
    var adjustX = -35;
    var adjustY = -65;

    // TODO select market in UI
    var market = 'FTSE100';

    var topic = '';
    var esError = '';
    var stompError = '';

    vm.Status = _.keyBy(['WAITING', 'LOADING', 'LOADED', 'ERROR'], _.identity);

    vm.status = vm.Status.WAITING;

    // vm.selectedSymbol = "";
    vm.selectedSymbol = $scope.item.symbol;

    vm.strategies = {};
    vm.actions = {};

    $scope.$watchGroup(['vm.selectedSymbol', 'vm.dateFrom'], function (newValues, oldValues) {
      if (!vm.selectedSymbol || !vm.dateFrom) {
        return;
      }
      $scope.item.symbol = vm.selectedSymbol;
      $scope.item.dateFrom = vm.dateFrom;
      vm.dateFrom.setHours(0);
      vm.dateFrom.setMinutes(0);
      vm.dateFrom.setSeconds(0);
      $log.log('detected updates: old:{0}, new:{1}'.format(
        angular.toJson(oldValues), angular.toJson(newValues)));
      doTable($scope.item);
    }, false);

    // set the size of the chart as the widget is resized...
    // $scope.$on('gridster-item-resized', function (item, gridsterWidget) {
    //   $log.debug('gridster-item-resized {0}x{1}'.format(
    //     gridsterWidget.getElementSizeX(), gridsterWidget.getElementSizeY()));
    //   vm.options.chart.width = gridsterWidget.getElementSizeX() + adjustX;
    //   vm.options.chart.height = gridsterWidget.getElementSizeY() + adjustY;
    // });

    // $scope.$watch('vm.values', function (newValues) {
    //   if (newValues) {
    //     vm.data = [{
    //       key: vm.selectedSymbol,
    //       values: newValues
    //     }];
    //   }
    // }, true);

    // ---------------------- datepicker stuff below ------------------
    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    vm.popup1 = {
      opened: false
    };

    // Disable weekend selection
    vm.isDisabled = function(date, mode) {
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };

    vm.today = function() {
      var dateFrom = new Date();
      dateFrom.setHours(0);
      dateFrom.setMinutes(0);
      dateFrom.setSeconds(0);
      vm.dateFrom = dateFrom;
    };

    vm.clear = function() {
      vm.dateFrom = null;
    };

    vm.open1 = function() {
      vm.popup1.opened = true;
    };

    vm.today();

    // update chart on date change...
    // $scope.$watch('vm.dateFrom', function (newValues) {
    //   if (newValues) {
    //     vm.dateFrom.setHours(0);
    //     vm.dateFrom.setMinutes(0);
    //     vm.dateFrom.setSeconds(0);
    //     $log.log('detected date update: ', vm.dateFrom);
    //     doTable($scope.item);
    //   }
    // }, true);

    function fetchStrategies() {
      turbineService.strategies().then(function (response) {
        vm.strategies = response.strategies;
        $log.info('available strategies : {0}'.format(angular.toJson(vm.strategies)));
      }, function (err) {
        esError = 'unable to load strategies: {0}'.format(err.message);
        $log.error(esError);
      });
    }

    function fetchHistoricDataFromES(from) {

      // TODO fetch all strategies..?
      var promise = elasticsearchService.getStrategyActionsAfter(market, vm.selectedSymbol, "SMAStrategy", from);

      promise.then(function (response) {
        utilService.traceLog($scope.item, "elasticsearch");
        vm.actions = elasticsearchService.parseResults(response);
      }, function (err) {
        esError = 'unable to load data: {0}:{1}'.format(vm.selectedSymbol, err.message);
        $log.error(esError);
      });
    }

    function subscribeToStompUpdates() {
      // TODO subscribed to all strategies..?
      topic = "/topic/strategies.{0}.{1}.*".format(market, vm.selectedSymbol);
      //ngstomp.subscribe(topic, onMessage, {}, $scope);

      try {
        ngstomp
          .subscribeTo(topic)
          .callback(onMessage)
          .withBodyInJson()
          .bindTo($scope)
          .connect();
        // throw new Error("unable to subscribe to topic: " + topic);
      } catch (err) {
        stompError = 'unable to connect to: {0}:{1}'.format(topic, err.message);
        $log.error(stompError);
      }
    }

    function onMessage(message) {
      // TODO avoid $scope?
      if (message.body.action === 'none') {
        return;
      }
      utilService.traceLog($scope.item, "rabbit");
      vm.actions.push(message.body);
      $scope.$apply();
    }


    function doTable(item) {
      $log.debug("strategy.table.controller.js::doChart");
      if (!vm.selectedSymbol) {
        return;
      }
      vm.status = vm.Status.LOADING;
      // $scope.item = item;
      item.name = vm.selectedSymbol;
      widgetService.unsubscribeTopic(topic);

      utilService.traceLog(item, "elasticsearch");

      // var sod = moment(0, "HH").format("x");
      var from = moment(vm.dateFrom).format("x");

      // get list of all available strategies from the turbine...
      fetchStrategies();

      // update vm.strategies with historic data from ES...
      fetchHistoricDataFromES(from);

      subscribeToStompUpdates();

      vm.status = vm.Status.LOADED;
      // vm.isLoaded = true;

      // TODO catch all errors and set the property and message as required
      if (esError !== '' || stompError !== '') {
        vm.status = vm.Status.ERROR;
        vm.hasError = true;
      }

    }


  }


})();
