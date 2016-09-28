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

    vm.Status = _.keyBy(['WAITING', 'LOADING', 'LOADED', 'ERROR'], _.identity);

    vm.status = vm.Status.WAITING;

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
            },
          }
        },
        data: [{
          values: [],
          key: "position",
          position: 0,
          color: "#d3da41",
          strokeWidth: 2,
        }, {
          values: [],
          key: "value",
          position: 1,
          color: "#4b9f51",
          strokeWidth: 3
        }, {
          values: [],
          key: "cash",
          position: 2,
          color: "#af2727",
          strokeWidth: 2
        }]
      }
    }

    // ---------------------------------------------------
    function onError(message, err) {
      vm.status = vm.Status.ERROR;
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
    };

    // ---------------------------------------------------
    function pushNewDataFromStompIntoChart(message) {
      // TODO avoid $scope?
      utilService.traceLog($scope.item, "rabbit");
      // TODO FP style...
      chartService.addData(vm.chart.data, message.body);
      $scope.$apply();
    };

    // -----------------------------------------------------
    // TODO due to ES client use of promises, we need to use callbacks...
    function fetchHistoricDataFromElasticsearch(market, symbol, strategy, fromMilliseconds, successCallback, errorCallback) {
      var promise = elasticsearchService.getStrategiesAfter(market, symbol, strategy.name, fromMilliseconds);
      promise.then(function (response) {
        var results = elasticsearchService.parseResults(response)
        successCallback(results);
      }, function (err) {
        errorCallback('unable to load ES data', err)
      });
    }

    // ---------------------------------------------------
    function doChart(item) {
      if (!vm.symbol || !vm.strategy || vm.symbol === "") {
        return;
      }
      $log.debug("strategy.controller.js::doChart");
      vm.status = vm.Status.LOADING;

      widgetService.unsubscribeTopic(topic);

      vm.chart = initialise();

      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      fetchHistoricDataFromElasticsearch(market, vm.symbol, vm.strategy, fromMilliseconds, loadElasticsearchDataIntoChart, onError);

      topic = widgetService.strategyTopicRoot + '.' +  market + '.' + vm.symbol + '.' + vm.strategy.name;
      stompSubscription = widgetService.subscribeToStompUpdates($scope, topic, pushNewDataFromStompIntoChart, onError);

      vm.status = vm.Status.LOADED;

    }

  }

})();
