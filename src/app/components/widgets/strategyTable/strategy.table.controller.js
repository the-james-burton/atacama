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


    vm.actions = {};

    // load the saved values...
    vm.ric = $scope.item.ric;
    vm.dateFrom = new Date($scope.item.dateFrom); // marshall saved string into Date object

    widgetService.startWatches(['ric', 'dateFrom'], doTable, $scope);

    // ---------------------------------------------------
    function onError(message, err) {
      status = widgetService.status.ERROR;
      var error = '{0}: {1}:{2}'.format(message, vm.ric, err.message);
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

    // ---------------------------------------------------
    function doTable(item) {
      if (!vm.ric) {
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
      // TODO fetch all strategies..?
      var promise = elasticsearchService.getStrategyActionsAfter(vm.ric, "SMAStrategy", fromMilliseconds);
      widgetService.resolveElasticsearchPromise(promise, loadElasticsearchDataIntoChart, onError);

      topic = widgetService.strategyTopicRoot + '.' + vm.ric + '.*';
      stompSubscription = widgetService.subscribeToStompUpdates($scope, topic, pushNewDataFromStompIntoChart, onError);

      status = widgetService.status.LOADED;

    }

  }


})();
