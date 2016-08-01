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
    elasticsearchService, chartService, turbineService, utilService) {
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

    vm.selectedSymbol = "";
    vm.strategies = {};

    $scope.$watch('vm.selectedSymbol', function (selectedSymbol) {
      if (!selectedSymbol) {
        return;
      }
      vm.selectedSymbol = selectedSymbol;
      $log.log('detected symbol update: ', vm.selectedSymbol);
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
      vm.dateFrom = new Date();
    };

    vm.clear = function() {
      vm.dateFrom = null;
    };

    vm.open1 = function() {
      vm.popup1.opened = true;
    };

    vm.today();

    // update chart on date change...
    $scope.$watch('vm.dateFrom', function (newValues) {
      if (newValues) {
        vm.dateFrom.setHours(0);
        vm.dateFrom.setMinutes(0);
        vm.dateFrom.setSeconds(0);
        $log.log('detected date update: ', vm.dateFrom);
        doTable($scope.item);
      }
    }, true);

    // ---------------------- datepicker stuff above ------------------

    // vm.reset = function () {
    //   $log.debug('reset()');
    //
    //   vm.status = vm.Status.WAITING;
    //   // vm.isLoaded = false;
    //   // vm.hasError = false;
    //
    //   vm.options = {
    //     chart: {
    //       // TODO error message appears in console...
    //     }
    //   };
    //
    //   vm.config = {
    //     deepWatchData: true,
    //     // deepWatchDataDepth: 1,
    //     refreshDataOnly: false,
    //     disabled: true
    //   };
    //
    //   vm.data = [];
    //
    // };
    //
    // vm.reset();

    // function initialise() {
    //   vm.config = {
    //     deepWatchData: true,
    //     // deepWatchDataDepth: 1,
    //     refreshDataOnly: false,
    //     disabled: false
    //   };
    //
    //   vm.options = {
    //     chart: {
    //       type: 'candlestickBarChart',
    //       // type: 'ohlcBarChart',
    //       // width: $scope.offsetParent.prop('offsetWidth') + adjustX,
    //       // height: $scope.offsetParent.prop('offsetHeight') + adjustY,
    //       width: $scope.gridsterItem.getElementSizeX() + adjustX,
    //       height: $scope.gridsterItem.getElementSizeY() + adjustY,
    //       margin: {
    //         top: 20,
    //         right: 40,
    //         bottom: 40,
    //         left: 40
    //       },
    //       x: function (d) {
    //         return d.date;
    //       },
    //       y: function (d) {
    //         return d.close;
    //       },
    //       showValues: true,
    //       transitionDuration: 500,
    //       xAxis: {
    //         // axisLabel: 'Dates',
    //         tickFormat: function (d) {
    //           return d3.time.format('%X')(new Date(d));
    //         },
    //       },
    //       yAxis: {
    //         // axisLabel: 'Stock Price',
    //         tickFormat: function (d, i) {
    //           return '$' + d3.format(',.1f')(d);
    //         }
    //       }
    //     }
    //   };
    // }

    // for smart-table...
    // $scope.addStrategies = function(widget) {
    //    console.log("widget.js::addStrategies");
    //    reset();
    //    $scope.typeStrategies = true;
    //    unsubscribeTopic();
    //  };

    // I don't think this is necessary anymore...
    // $scope.$on('$destroy', function() {
    //   utilService.unsubscribeTopic(topic);
    // });

    // function fetchStocks() {
    //   turbineService.symbols(market).then(function (response) {
    //     // console.log(angular.toJson(response.stocks));
    //     vm.symbols = _.map(response.stocks, 'symbol');
    //     // $scope.selectedSymbol = $scope.symbols[0];
    //   }, function (err) {
    //     esError = 'unable to load symbols: {0}'.format(err.message);
    //     $log.error(esError);
    //   });
    // }

    function fetchHistoricDataFromES(from) {

      // TODO fetch all strategies..?
      var promise = elasticsearchService.getStrategiesAfter(market, vm.selectedSymbol, "SMAStrategy", from);

      promise.then(function (response) {
        utilService.traceLog($scope.item, "elasticsearch");
        vm.strategies = elasticsearchService.parseResults(response);
      }, function (err) {
        esError = 'unable to load data: {0}:{1}'.format(vm.selectedSymbol, err.message);
        $log.error(esError);
      });
    }

    function subscribeToStompUpdates() {
      topic = '/topic/ticks.' + market + '.' + vm.selectedSymbol;
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
      utilService.traceLog($scope.item, "rabbit");
      vm.strategies.push(message.body);
      $scope.$apply();
    }


    function doTable(item) {
      $log.debug("strategy.table.controller.js::doChart");
      if (vm.selectedSymbol === "") {
        return;
      }
      vm.status = vm.Status.LOADING;
      // $scope.item = item;
      item.name = vm.selectedSymbol;
      utilService.unsubscribeTopic(topic);

      utilService.traceLog(item, "elasticsearch");

      // var sod = moment(0, "HH").format("x");
      var from = moment(vm.dateFrom).format("x");

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
