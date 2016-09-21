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

    // adjustments to make the chart fit better in the widget...
    // TODO it works in the browser, but PhantomJS gives this error
    // if we use ES6 keyword 'const' for these variables..
    // PhantomJS 2.1.1 (Linux 0.0.0) ERROR SyntaxError: Unexpected token 'const'
    var adjustX = -35;
    var adjustY = -65;

    // TODO select market in UI
    var market = 'FTSE100';

    var topic = '';
    var esError = '';
    var stompError = '';
    var stompSubscription = '';

    vm.Status = _.keyBy(['WAITING', 'LOADING', 'LOADED', 'ERROR'], _.identity);

    vm.status = vm.Status.WAITING;

    vm.chart = {};

    // load the saved values...
    vm.selectedSymbol = $scope.item.symbol;
    vm.dateFrom = new Date($scope.item.dateFrom); // marshall saved string into Date object

    vm.chart = widgetService.emptyChart();

    startWatches();

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
            width: $scope.gridsterItem.getElementSizeX() + adjustX,
            height: $scope.gridsterItem.getElementSizeY() + adjustY,
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
      var error = '{0}: {1}:{2}'.format(message, vm.selectedSymbol, err.message);
      $log.error(error);
      return error;
    }


    // NOTE this has side-effects (setups up angular watches), I don't think this can be avoided...
    function startWatches() {
      // if any user input changes, re-do the chart...
      $scope.$watchGroup(['vm.selectedSymbol', 'vm.dateFrom'], function (newValues, oldValues) {

        $log.info('selectedSymbol:{0}, dateFrom:{1}'.format(newValues[0], newValues[1]));

        // TODO use lodash to filter for undefined of 'Invalid Date',
        // then check that the resulting array is empty...
        // _(newValues).filter


        // if we have not got both values then abort...
        if (!vm.selectedSymbol || !vm.dateFrom) {
          return;
        }

        $scope.item.symbol = vm.selectedSymbol;
        $scope.item.dateFrom = vm.dateFrom;
        $log.log('detected updates: old:{0}, new:{1}'.format(
          angular.toJson(oldValues), angular.toJson(newValues)));
        doChart($scope.item);
      }, false);

      // set the size of the chart as the widget is resized...
      $scope.$on('gridster-item-resized', function (item, gridsterWidget) {
        $log.debug('gridster-item-resized {0}x{1}'.format(
          gridsterWidget.getElementSizeX(), gridsterWidget.getElementSizeY()));
        vm.chart.options.chart.width = gridsterWidget.getElementSizeX() + adjustX;
        vm.chart.options.chart.height = gridsterWidget.getElementSizeY() + adjustY;
        // TODO now causes an error... is this needed?
        // $scope.api.update();
      });
    }

    function doChart(item) {
      if (!vm.selectedSymbol) {
        return;
      }

      $log.debug("ohlc.controller.js::doChart");
      vm.status = vm.Status.LOADING;
      // vm.chart = widgetService.emptyChart();
      widgetService.unsubscribeTopic(topic);

      vm.chart = initialise(vm.selectedSymbol);

      // var sod = moment(0, "HH").format("x");
      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      widgetService.fetchHistoricDataFromElasticsearch(market, vm.selectedSymbol, fromMilliseconds,
        function (results) {
          // vm.chart.data[0].values = vm.chart.data[0].values.concat(results);
          vm.chart.data[0].values = results;
        }, onError);

      try {
        stompSubscription = widgetService.subscribeToStompUpdates($scope, '/topic/ticks', market, vm.selectedSymbol,
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
