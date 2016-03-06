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
    elasticsearchService, chartService, turbineService, utilService) {
    var vm = this;

    vm.isLoaded = false;
    vm.hasError = false;
    vm.selectedSymbol = "...";
    vm.selectedIndicator = "...";
    vm.values = {};

    vm.selectSymbol = function (selectedSymbol) {
      vm.selectedSymbol = selectedSymbol;
      $log.log('select symbol: ', vm.selectedSymbol);
    };

    vm.selectIndicator = function (selectedIndicator) {
      vm.selectedIndicator = selectedIndicator;
      $log.log('select indicator: ', vm.selectedIndicator);
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
    fetchIndicators();

    // set the size of the chart as the widget is resized...
    $scope.$on('gridster-item-resized', function (item, gridsterWidget) {
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
          type: 'multiChart',
          width: $scope.gridsterItem.getElementSizeX() + adjustX,
          height: $scope.gridsterItem.getElementSizeY() + adjustY,
          margin: {
            top: 20,
            right: 40,
            bottom: 40,
            left: 40
          },
          //x: function (d) {
          //   return d['date'];
          // },
          // y: function (d) {
          //  return d['closePriceIndicator'];
          // },
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
      };
    }

    // TODO make these fetch functions more functional in style...

    function fetchStocks() {
      turbineService.symbols(market).then(function (response) {
        // console.log(JSON.stringify(response.stocks));
        vm.symbols = _.map(response.stocks, 'symbol');
        // $scope.selectedSymbol = $scope.symbols[0];
      }, function (err) {
        esError = 'unable to load symbols({0}): {1}'.format(market, err.message);
        console.trace(esError);
      });
    }

    function fetchIndicators() {
      turbineService.indicators().then(function (response) {
        vm.indicators = response.indicators;
      }, function (err) {
        esError = 'unable to load indicators: {0}'.format(err.message);
        console.trace(esError);
      });
    }

    function fetchHistoricDataFromES() {
      var promise = elasticsearchService.getIndicatorsAfter(vm.selectedSymbol, vm.selectedIndicator.name, sod);
      utilService.traceLog($scope.item, "elasticsearch");

      promise.then(function (response) {
        var closeSeries = {
          values: [],
          key: "close",
          type: "line",
          yAxis: 1,
          position: 0,
          color: "#bdc42d",
          strokeWidth: 2,
        };
        // based on the first indicator tick, generate the chart series...
        var results = elasticsearchService.parseResults(response);
        // if our indicator is an overlay, then that will affect the series generation...
        var overlay = _.result(_.find(vm.indicators, {
          'name': results[0].name
        }), 'overlay');
        // console.log("{0} is overlay:{1}".format(results[0].name, overlay));
        var data = chartService.generateChartSeries(results[0], overlay);
        // add the always present close series to the front of the chart series array...
        data.unshift(closeSeries);
        // convert the indicator ticks into chart data values...
        chartService.convertData(data, results);
        // export the results...
        vm.data = data;
      }, function (err) {
        esError = 'unable to load data: {0}:{1}:{2}'.format(vm.selectedSymbol, vm.selectedIndicator, err.message);
        console.trace(esError);
      });
    }

    function subscribeToStompUpdates() {
      topic = '/topic/indicators.' + market + '.' + vm.selectedSymbol + '.' + vm.selectedIndicator.name;
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
      chartService.addData(vm.data, message.body);
      $scope.$apply();
    }


    function doChart(item) {
      console.log("indicator.controller.js::doChart");
      // $scope.item = item;
      item.name = vm.selectedSymbol;
      reset();
      vm.typeOHLC = true;
      utilService.unsubscribeTopic(topic);

      if (vm.selectedSymbol === "...") {
        return;
      }

      initialise();

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
