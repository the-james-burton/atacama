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
    .controller('OhlcWidgetController', OhlcWidgetController);

  function OhlcWidgetController(
    $scope, ngstomp, $resource, $log, Restangular,
    elasticsearchService, chartService, turbineService, utilService, widgetService) {
    var vm = this;


    // TODO select exchange in UI
    var exchange = 'LSE';

    var topic = '';
    var stompSubscription = '';
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
    vm.ticker = $scope.item.ticker;
    vm.dateFrom = new Date($scope.item.dateFrom); // marshall saved string into Date object

    vm.chart = widgetService.emptyChart();

    widgetService.startWatches(['ticker', 'dateFrom'], doChart, $scope);

    // ---------------------------------------------------
    function initialise(ticker) {
      return {
        config: {
          deepWatchData: true,
          // deepWatchDataDepth: 1,
          refreshDataOnly: false,
          disabled: false
        },
        options: {
          chart: {
            type: 'candlestickBarChart',
            // type: 'ohlcBarChart',
            // width: $scope.offsetParent.prop('offsetWidth') + adjustX,
            // height: $scope.offsetParent.prop('offsetHeight') + adjustY,
            width: $scope.gridsterItem.getElementSizeX() + widgetService.adjustX,
            height: $scope.gridsterItem.getElementSizeY() + widgetService.adjustY,
            margin: {
              top: 20,
              right: 40,
              bottom: 40,
              left: 40
            },
            x: function (d) {
              return d.date;
            },
            y: function (d) {
              return d.close;
            },
            showValues: true,
            transitionDuration: 500,
            xAxis: {
              // axisLabel: 'Dates',
              tickFormat: function (d) {
                return d3.time.format('%X')(new Date(d));
              },
            },
            yAxis: {
              // axisLabel: 'Stock Price',
              tickFormat: function (d, i) {
                return '$' + d3.format(',.1f')(d);
              }
            }
          }
        },
        data: [{
          key: ticker,
          values: []
        }]
      };
    }

    // ---------------------------------------------------
    function onError(message, err) {
      status = widgetService.status.ERROR;
      var error = '{0}: {1}:{2}'.format(message, vm.ticker, err.message);
      $log.error(error);
      return error;
    }

    // ---------------------------------------------------
    function loadElasticsearchDataIntoChart(results) {
      // vm.chart.data[0].values = vm.chart.data[0].values.concat(results);
      vm.chart.data[0].values = results;
    };

    // ---------------------------------------------------
    function pushNewDataFromStompIntoChart(message) {
      // TODO avoid $scope?
      utilService.traceLog($scope.item, "rabbit");
      // use JSON.parse(message.body) if not already an object...
      vm.chart.data[0].values.push(message.body);
      // $scope.$apply();
    };

    // ---------------------------------------------------
    function doChart(item) {
      if (!vm.ticker) {
        return;
      }

      $log.debug("ohlc.controller.js::doChart");
      status = widgetService.status.LOADING;
      // vm.chart = widgetService.emptyChart();
      widgetService.unsubscribeTopic(topic);

      vm.chart = initialise(vm.ticker);

      // var sod = moment(0, "HH").format("x");
      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      var promise = elasticsearchService.getTicksAfter(vm.ticker, fromMilliseconds);
      widgetService.resolveElasticsearchPromise(promise, loadElasticsearchDataIntoChart, onError);

      topic = widgetService.tickTopicRoot + '.' + vm.ticker;
      stompSubscription = widgetService.subscribeToStompUpdates($scope, topic, pushNewDataFromStompIntoChart, onError);

      status = widgetService.status.LOADED;

    }

  }


})();
