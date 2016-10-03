(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:WidgetController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('StrategyWidgetController', StrategyWidgetController);

  function StrategyWidgetController(
    $scope, ngstomp, $resource, $log, Restangular,
    elasticsearchService, chartService, turbineService, utilService, widgetService) {
    var vm = this;

    // var sod = moment(0, "HH").format("x");

    // TODO select market in UI
    var market = 'FTSE100';

    var topic = '';
    var stompSubscription = '';

    // TODO datepicker...
    var sod = new Date();
    sod.setHours(0);
    sod.setMinutes(0);
    sod.setSeconds(0);

    var status = widgetService.status.WAITING;

    // ---------------------------------------------------
    vm.isLoading = function () {
      return status === widgetService.status.LOADING;
    };

    vm.isLoaded = function () {
      return status === widgetService.status.LOADED;
    };

    vm.isError = function () {
      return status === widgetService.status.ERROR;
    };

    vm.chart = {};

    // load the saved values...
    vm.symbol = $scope.item.symbol;
    vm.strategy = $scope.item.strategy;
    vm.dateFrom = sod;

    vm.chart = widgetService.emptyChart();

    widgetService.startWatches(['symbol', 'strategy', 'dateFrom'], doChart, $scope);


    // ---------------------------------------------------
    function initialise() {
      return {
        config: {
          deepWatchData: true,
          // deepWatchDataDepth: 1,
          refreshDataOnly: false,
          disabled: false
        },
        options: {
          chart: {
            // linePlusBarChart gets the xaxis correct,
            // but then seems to drop part of a bar series... :(
            type: 'lineChart',
            width: $scope.gridsterItem.getElementSizeX() + widgetService.adjustX,
            height: $scope.gridsterItem.getElementSizeY() + widgetService.adjustY,
            margin: {
              top: 20,
              right: 40,
              bottom: 40,
              left: 40
            },
            showLegend: false,
            showValues: true,
            transitionDuration: 500,
            focusEnable:false,
            xAxis: {
              // axisLabel: 'Dates',
              tickFormat: function (d) {
                return d3.time.format('%X')(new Date(d));
              },
            },
            yAxis: {
              // axisLabel: 'Value',
              tickFormat: function (d, i) {
                return '$' + d3.format(',.1f')(d);
              }
            }
          }
        },
        data: [{
          values: [],
          bar: false,
          key: "position",
          position: 0,
          color: "#d3da41",
          strokeWidth: 2,
        }, {
          values: [],
          bar: true,
          key: "value",
          position: 1,
          color: "#4b9f51",
          strokeWidth: 2
        }, {
          values: [],
          bar: true,
          key: "cash",
          position: 2,
          color: "#af2727",
          strokeWidth: 2
        }]
      }
    }

    // ---------------------------------------------------
    function onError(message, err) {
      status = widgetService.status.ERROR;
      var error = '{0}: {1}:{2}'.format(message, vm.symbol, err.message);
      $log.error(error);
      return error;
    }

    // ---------------------------------------------------
    function loadElasticsearchDataIntoChart(results) {
      // convert the strategy ticks into chart data values...
      // TODO this function mutates the 'data' parameter... rewrite FP style...
      chartService.convertData(vm.chart.data, results);
      // export the results...
      // vm.chart.data = data;
      // $log.info(angular.toJson(vm.chart.data));
    };

    // ---------------------------------------------------
    function pushNewDataFromStompIntoChart(message) {
      // TODO avoid $scope?
      utilService.traceLog($scope.item, "rabbit");
      // TODO FP style...
      chartService.addData(vm.chart.data, message.body);
      // $scope.$apply();
    };

    // ---------------------------------------------------
    function doChart(item) {
      if (!vm.symbol || !vm.strategy || vm.symbol === "") {
        return;
      }
      $log.debug("strategy.controller.js::doChart");
      status = widgetService.status.LOADING;

      widgetService.unsubscribeTopic(topic);

      vm.chart = initialise();

      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      var promise = elasticsearchService.getStrategiesAfter(market, vm.symbol, vm.strategy.name, fromMilliseconds);
      widgetService.resolveElasticsearchPromise(promise, loadElasticsearchDataIntoChart, onError);

      topic = widgetService.strategyTopicRoot + '.' +  market + '.' + vm.symbol + '.' + vm.strategy.name;
      stompSubscription = widgetService.subscribeToStompUpdates($scope, topic, pushNewDataFromStompIntoChart, onError);

      status = widgetService.status.LOADED;

    }

  }

})();
