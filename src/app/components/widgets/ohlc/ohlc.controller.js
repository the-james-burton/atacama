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
    elasticsearchService, chartService, turbineService, utilService) {
    var vm = this;

    vm.isLoaded = false;
    vm.hasError = false;
    vm.selectedSymbol = "...";
    vm.values = {};

    vm.selectSymbol = function (selectedSymbol) {
      vm.selectedSymbol = selectedSymbol;
      $log.log('select symbol: ', vm.selectedSymbol);
      doChart($scope.item);
    };

    // var url = 'http://localhost:48002';
    var sod = moment(0, "HH").format("x");
    // var subscription;

    // adjustments to make the chart fit better in the widget...
    var adjustX = -35;
    var adjustY = -65;

    // TODO select market in UI
    var market = 'FTSE100';

    var topic = '';
    var esError = '';
    var stompError = '';

    // TODO centralise the rest call data more so widgets can share the results...
    // {"stocks":[{"market":"FTSE100","symbol":"ABC"},{"market":"FTSE100","symbol":"DEF"}]}
    // {"indicators":[{"overlay":true,"name":"BollingerBands"},{"overlay":false,"name":"SMA12"}]}
    // {"strategies":[{"name":"SMAStrategy"},{"name":"CCICorrectionStrategy"}]}

    reset();

    fetchStocks();

    // $scope.strategies = [
    //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
    //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
    //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
    //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
    //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
    //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
    //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
    //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'},
    //   { action: 'sell', symbol: 'ABC', market: 'FTSE100'},
    //   { action: 'buy', symbol: 'DEF', market: 'FTSE100'}
    // ];

    // set the size of the chart as the widget is resized...
    $scope.$on('gridster-item-resized', function (item, gridsterWidget) {
      // $log.debug('gridster-item-resized offset {0}x{1}'.format($scope.offsetParent.prop('offsetWidth'), $scope.offsetParent.prop('offsetHeight')));
      // $log.debug('gridster-item-resized dimensions {0}x{1}'.format(gridsterWidget.getElementSizeX(), gridsterWidget.getElementSizeY()));
      //vm.options.chart.height = firstHeight + ((item.targetScope.gridsterItem.sizeY - 1) * nextHeight);
      //vm.options.chart.width = firstWidth + ((item.targetScope.gridsterItem.sizeX - 1) * nextWidth);
      //console.log('offsetHeight:' + $scope.offsetParent.prop('offsetHeight'));
      //console.log('offsetWidth:' + $scope.offsetParent.prop('offsetWidth'));

      $log.debug('gridster-item-resized {0}x{1}'.format(
        gridsterWidget.getElementSizeX(), gridsterWidget.getElementSizeY()));
      vm.options.chart.width = gridsterWidget.getElementSizeX() + adjustX;
      vm.options.chart.height = gridsterWidget.getElementSizeY() + adjustY;
      // TODO now causes an error... is this needed?
      // $scope.api.update();
    });

    $scope.$watch('vm.values', function (newValues) {
      if (newValues) {
        vm.data = [{
          key: vm.selectedSymbol,
          values: newValues
        }];
      }
    }, true);

    function reset() {
      $log.debug('reset()');
      vm.isLoaded = false;
      vm.hasError = false;

      vm.options = {
        chart: {
          // TODO error message appears in console...
        }
      };

      vm.config = {
        deepWatchData: true,
        // deepWatchDataDepth: 1,
        refreshDataOnly: false,
        disabled: true
      };

      vm.data = [];
      // vm.data = {key: vm.selectedSymbol, values: [{}]};
      // vm.data = {key: '', values: [{}]};

    }

    function initialise() {
      vm.config = {
        deepWatchData: true,
        // deepWatchDataDepth: 1,
        refreshDataOnly: false,
        disabled: false
      };

      vm.options = {
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
            return d['date'];
          },
          y: function (d) {
            return d['close'];
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

    function fetchStocks() {
      turbineService.symbols(market).then(function (response) {
        // console.log(angular.toJson(response.stocks));
        vm.symbols = _.map(response.stocks, 'symbol');
        // $scope.selectedSymbol = $scope.symbols[0];
      }, function (err) {
        esError = 'unable to load symbols: {0}'.format(err.message);
        console.trace(esError);
      });
    }

    function fetchHistoricDataFromES() {
      var promise = elasticsearchService.getTicksAfter(vm.selectedSymbol, sod);

      promise.then(function (response) {
        utilService.traceLog($scope.item, "elasticsearch");
        vm.values = elasticsearchService.parseResults(response);
      }, function (err) {
        esError = 'unable to load data: {0}:{1}'.format(vm.selectedSymbol, err.message);
        console.trace(esError);
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
        console.trace(stompError);
      }
    }

    function onMessage(message) {
      // TODO avoid $scope?
      utilService.traceLog($scope.item, "rabbit");
      // vm.data[0].values.push(JSON.parse(message.body));
      vm.data[0].values.push(message.body);
      $scope.$apply();
    }


    function doChart(item) {
      console.log("ohlc.controller.js::doChart");
      // $scope.item = item;
      item.name = vm.selectedSymbol;
      reset();
      vm.typeOHLC = true;
      utilService.unsubscribeTopic(topic);

      if (vm.selectedSymbol === "...") {
        return;
      }

      initialise();

      // $scope.message = moment();

      // var ticks = Restangular.one('tick').one($scope.selectedSymbol).one(sod);

      // ticks.get().then(function(response) {
      //     vm.data[0].values = response.ticks;
      // });

      utilService.traceLog(item, "elasticsearch");
      fetchHistoricDataFromES();

      subscribeToStompUpdates();

      vm.isLoaded = true;

      // TODO catch all errors and set the property and message as required
      if (esError !== '' || stompError !== '') {
        vm.hasError = true;
      }

    }


  }


})();
