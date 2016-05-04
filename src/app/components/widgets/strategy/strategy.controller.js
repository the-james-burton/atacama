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
    elasticsearchService, chartService, turbineService, utilService) {
    var vm = this;

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


    vm.isLoaded = false;
    vm.hasError = false;
    vm.selectedSymbol = "...";
    vm.selectedStrategy = "...";
    vm.values = {};

    vm.selectSymbol = function (selectedSymbol) {
      vm.selectedSymbol = selectedSymbol;
      $log.log('select symbol: ', vm.selectedSymbol);
    };

    vm.selectStrategy = function (selectedStrategy) {
      vm.selectedStrategy = selectedStrategy;
      $log.log('select strategy: ', vm.selectedStrategy);
      doChart($scope.item);
    };

    // TODO centralise the rest call data more so widgets can share the results...
    // {"stocks":[{"market":"FTSE100","symbol":"ABC"},{"market":"FTSE100","symbol":"DEF"}]}
    // {"strategies":[{"overlay":true,"name":"BollingerBands"},{"overlay":false,"name":"SMA12"}]}
    // {"strategies":[{"name":"SMAStrategy"},{"name":"CCICorrectionStrategy"}]}

    reset();
    fetchStocks();
    fetchStrategies();

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
          type: 'lineChart',
          width: $scope.gridsterItem.getElementSizeX() + adjustX,
          height: $scope.gridsterItem.getElementSizeY() + adjustY,
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
          yAxis: {
            // axisLabel: 'Value',
            tickFormat: function (d, i) {
              return '$' + d3.format(',.1f')(d);
            }
          },
        }
      };

      vm.data = [{
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
      }];

    }

    // TODO make these fetch functions more functional in style...

    function fetchStocks() {
      turbineService.symbols(market).then(function (response) {
        // console.log(angular.toJson(response.stocks));
        vm.symbols = _.map(response.stocks, 'symbol');
        // $scope.selectedSymbol = $scope.symbols[0];
      }, function (err) {
        esError = 'unable to load symbols({0}): {1}'.format(market, err.message);
        $log.error(esError);
      });
    }

    function fetchStrategies() {
      turbineService.strategies().then(function (response) {
        vm.strategies = response.strategies;
      }, function (err) {
        esError = 'unable to load strategies: {0}'.format(err.message);
        $log.error(esError);
      });
    }

    function fetchHistoricDataFromES() {
      var promise = elasticsearchService.getStrategiesAfter(vm.selectedSymbol, vm.selectedStrategy.name, sod);
      utilService.traceLog($scope.item, "elasticsearch");

      promise.then(function (response) {
        var results = elasticsearchService.parseResults(response);
        chartService.convertData(vm.data, results);
      }, function (err) {
        esError = 'unable to load data: {0}:{1}:{2}'.format(vm.selectedSymbol, vm.selectedStrategy, err.message);
        $log.error(esError);
      });
    }

    function subscribeToStompUpdates() {
      topic = '/topic/strategies.' + market + '.' + vm.selectedSymbol + '.' + vm.selectedStrategy.name;
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
      chartService.addData(vm.data, message.body);
      $scope.$apply();
    }


    function doChart(item) {
      $log.debug("strategy.controller.js::doChart");
      // $scope.item = item;
      item.name = vm.selectedSymbol;
      reset();
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
