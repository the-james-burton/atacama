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
    .controller('IndicatorWidgetController', IndicatorWidgetController);

  function IndicatorWidgetController(
    $scope, ngstomp, $resource, $log, Restangular,
    elasticsearchService, chartService, turbineService, utilService, widgetService) {
    var vm = this;

    // var sod = moment(0, "HH").format("x");

    // TODO select exchange in UI
    var exchange = 'LSE';

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
    vm.ric = $scope.item.ric;
    vm.indicator = $scope.item.indicator;
    vm.dateFrom = sod;

    vm.chart = widgetService.emptyChart();

    widgetService.startWatches(['ric', 'indicator', 'dateFrom'], doChart, $scope);

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
            type: 'multiChart',
            width: $scope.gridsterItem.getElementSizeX() + widgetService.djustX,
            height: $scope.gridsterItem.getElementSizeY() + widgetService.adjustY,
            margin: {
              top: 20,
              right: 40,
              bottom: 40,
              left: 40
            },
            showValues: true,
            showLegend: false,
            transitionDuration: 500,
            xAxis: {
              // axisLabel: 'Dates',
              tickFormat: function (d) {
                return d3.time.format('%X')(new Date(d));
              },
            },
            yAxis1: {
              // axisLabel: 'Stock Price',
              tickFormat: function (d, i) {
                return '$' + d3.format(',.1f')(d);
              }
            },
            yAxis2: {
              // axisLabel: 'Stock Price',
              tickFormat: function (d, i) {
                return d3.format(',.1f')(d);
              }
            }
          }
        }
      }
    }

    // ---------------------------------------------------
    function onError(message, err) {
      status = widgetService.status.ERROR;
      var error = '{0}: {1}:{2}'.format(message, vm.ric, err.message);
      $log.error(error);
      return error;
    }

    // ---------------------------------------------------
    function loadElasticsearchDataIntoChart(results) {
      var closeSeries = {
        values: [],
        key: "close",
        type: "line",
        yAxis: 1,
        position: 0,
        color: "#bdc42d",
        strokeWidth: 2,
      };
      // if our indicator is an overlay, then that will affect the series generation...
      var overlay = vm.indicator.overlay;
      // var overlay = _.result(_.find(vm.indicators, {
      //   name: results[0].name
      // }), 'overlay');
      // console.log("{0} is overlay:{1}".format(results[0].name, overlay));
      var data = chartService.generateChartSeries(results[0], overlay);
      // add the always present close series to the front of the chart series array...
      data.unshift(closeSeries);
      // convert the indicator ticks into chart data values...
      chartService.convertData(data, results);
      // export the results...
      vm.chart.data = data;
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
      if (!vm.ric || !vm.indicator || vm.ric === "") {
        return;
      }
      $log.debug("indicator.controller.js::doChart");
      status = widgetService.status.LOADING;

      widgetService.unsubscribeTopic(topic);

      vm.chart = initialise();

      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      var promise = elasticsearchService.getIndicatorsAfter(vm.ric, vm.indicator.name, fromMilliseconds);
      widgetService.resolveElasticsearchPromise(promise, loadElasticsearchDataIntoChart, onError);

      topic = widgetService.indicatorTopicRoot + '.' + vm.ric + '.' + vm.indicator.name;
      stompSubscription = widgetService.subscribeToStompUpdates($scope, topic, pushNewDataFromStompIntoChart, onError);

      status = widgetService.status.LOADED;

    }

  }

})();
