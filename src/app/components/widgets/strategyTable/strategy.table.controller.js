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
    .controller('StrategyTableController', StrategyTableController);

  function StrategyTableController(
    $scope, ngstomp, $resource, $log, Restangular,
    elasticsearchService, chartService, turbineService, utilService, widgetService) {
    var vm = this;


    // TODO select market in UI
    var market = 'FTSE100';

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


    vm.actions = {};

    // load the saved values...
    vm.symbol = $scope.item.symbol;
    vm.dateFrom = new Date($scope.item.dateFrom); // marshall saved string into Date object

    widgetService.startWatches(['symbol', 'dateFrom'], doTable, $scope);

    // ---------------------------------------------------
    function onError(message, err) {
      status = widgetService.status.ERROR;
      var error = '{0}: {1}:{2}'.format(message, vm.symbol, err.message);
      $log.error(error);
      return error;
    }

    // ---------------------------------------------------
    function loadElasticsearchDataIntoChart(results) {
      vm.actions = results;
    };

    // ---------------------------------------------------
    function pushNewDataFromStompIntoChart(message) {
      // don't show 'none' actions...
      if (message.body.action === 'none') {
        return;
      }
      // TODO avoid $scope?
      utilService.traceLog($scope.item, "rabbit");
      vm.actions.push(message.body);
      // $scope.$apply();
    };

    // -----------------------------------------------------
    // TODO due to ES client use of promises, we need to use callbacks...
    function fetchHistoricDataFromElasticsearch(market, selectedSymbol, fromMilliseconds, successCallback, errorCallback) {
      // TODO fetch all strategies..?
      var promise = elasticsearchService.getStrategyActionsAfter(market, vm.symbol, "SMAStrategy", fromMilliseconds);
      promise.then(function (response) {
        var results = elasticsearchService.parseResults(response)
        successCallback(results);
      }, function (err) {
        errorCallback('unable to load ES data', err)
      });
    }

    // ---------------------------------------------------
    function doTable(item) {
      if (!vm.symbol) {
        return;
      }

      $log.debug("strategy.table.controller.js::doChart");
      status = widgetService.status.LOADING;
      // vm.chart = widgetService.emptyChart();
      widgetService.unsubscribeTopic(topic);

      // var sod = moment(0, "HH").format("x");
      var fromMilliseconds = moment(vm.dateFrom).format("x");
      utilService.traceLog(item, "elasticsearch");

      // NOTE can't use return value because ES client uses promises...
      fetchHistoricDataFromElasticsearch(market, vm.symbol, fromMilliseconds, loadElasticsearchDataIntoChart, onError);

      topic = widgetService.strategyTopicRoot + '.' +  market + '.' + vm.symbol + '.*';
      stompSubscription = widgetService.subscribeToStompUpdates($scope, topic, pushNewDataFromStompIntoChart, onError);

      status = widgetService.status.LOADED;

    }

  }


})();
