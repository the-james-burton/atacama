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

    vm.Status = _.keyBy(['WAITING', 'LOADING', 'LOADED', 'ERROR'], _.identity);

    vm.status = vm.Status.WAITING;

    vm.chart = {};

    //vm.isLoaded = false;
    //vm.hasError = false;

    // load the saved values...
    vm.selectedSymbol = $scope.item.symbol;
    vm.dateFrom = $scope.item.dateFrom;

    startWatches();

    // ---------------------- datepicker stuff below ------------------
    // ---------------------- datepicker stuff above ------------------

    vm.reset = function () {
      $log.debug('reset()');

      vm.status = vm.Status.WAITING;
      // vm.isLoaded = false;
      // vm.hasError = false;

      vm.chart.options = {
        chart: {
          // TODO error message appears in console...
        }
      };

      vm.chart.config = {
        deepWatchData: true,
        // deepWatchDataDepth: 1,
        refreshDataOnly: false,
        disabled: true
      };

      vm.chart.data = [];
      // vm.data = {key: vm.selectedSymbol, values: [{}]};
      // vm.data = {key: '', values: [{}]};

    };

    vm.reset();

    function initialise() {
      vm.chart.config = {
        deepWatchData: true,
        // deepWatchDataDepth: 1,
        refreshDataOnly: false,
        disabled: false
      };

      vm.chart.options = {
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
      };
    }

    function fetchHistoricDataFromES(from) {
      var promise = elasticsearchService.getTicksAfter(market, vm.selectedSymbol, from);

      promise.then(function (response) {
        utilService.traceLog($scope.item, "elasticsearch");
        var result = elasticsearchService.parseResults(response);
        vm.chart.data = [{
          key: vm.selectedSymbol,
          values: result
        }];

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
      // vm.data[0].values.push(JSON.parse(message.body));
      vm.chart.data[0].values.push(message.body);
      $scope.$apply();
    }

    function startWatches() {
      // if any user input changes, re-do the chart...
      $scope.$watchGroup(['vm.selectedSymbol', 'vm.dateFrom'], function (newValues, oldValues) {
        if (!vm.selectedSymbol || !vm.dateFrom) {
          return;
        }
        $scope.item.symbol = vm.selectedSymbol;
        $scope.item.dateFrom = vm.dateFrom;
        // vm.dateFrom.setHours(0);
        // vm.dateFrom.setMinutes(0);
        // vm.dateFrom.setSeconds(0);
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
      // $scope.item = item;
      // item.name = vm.selectedSymbol;
      vm.reset();
      // vm.typeOHLC = true;
      utilService.unsubscribeTopic(topic);

      initialise();

      // $scope.message = moment();

      // var ticks = Restangular.one('tick').one($scope.selectedSymbol).one(sod);

      // ticks.get().then(function(response) {
      //     vm.data[0].values = response.ticks;
      // });

      utilService.traceLog(item, "elasticsearch");

      // var sod = moment(0, "HH").format("x");
      var from = moment(vm.dateFrom).format("x");
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
