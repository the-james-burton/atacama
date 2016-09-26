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


    // TODO select market in UI
    var market = 'FTSE100';

    var topic = '';
    var esError = '';
    var stompError = '';
    var stompSubscription = '';

    $log.info(widgetService.adjustX);

    vm.Status = _.keyBy(['WAITING', 'LOADING', 'LOADED', 'ERROR'], _.identity);

    vm.status = vm.Status.WAITING;

    vm.chart = {};

    // load the saved values...
    vm.symbol = $scope.item.symbol;
    vm.dateFrom = new Date($scope.item.dateFrom); // marshall saved string into Date object

    vm.chart = widgetService.emptyChart();

    widgetService.startWatches(['symbol', 'dateFrom'], doChart, $scope);

    function initialise(symbol) {
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
          key: symbol,
          values: []
        }]
      };
    }

    function onError(message, err) {
      vm.status = vm.Status.ERROR;
      var error = '{0}: {1}:{2}'.format(message, vm.symbol, err.message);
      $log.error(error);
      return error;
    }


    function doChart(item) {
      if (!vm.symbol) {
        return;
      }

      $log.debug("ohlc.controller.js::doChart");
      vm.status = vm.Status.LOADING;
      // vm.chart = widgetService.emptyChart();
      widgetService.unsubscribeTopic(topic);

      vm.chart = initialise(vm.symbol);

      // var sod = moment(0, "HH").format("x");
      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      widgetService.fetchHistoricDataFromElasticsearch(market, vm.symbol, fromMilliseconds,
        function (results) {
          // vm.chart.data[0].values = vm.chart.data[0].values.concat(results);
          vm.chart.data[0].values = results;
        }, onError);

      try {
        stompSubscription = widgetService.subscribeToStompUpdates($scope, '/topic/ticks', market, vm.symbol,
          function (message) {
            // TODO avoid $scope?
            utilService.traceLog($scope.item, "rabbit");
            // use JSON.parse(message.body) if not already an object...
            vm.chart.data[0].values.push(message.body);
            // $scope.$apply();
          });
      } catch (err) {
        onError('unable to STOMP connect to', err);
      }

      vm.status = vm.Status.LOADED;

    }


  }


})();
