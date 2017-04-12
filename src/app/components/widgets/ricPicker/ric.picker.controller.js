(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:RicPickerController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('RicPickerController', RicPickerController);

  function RicPickerController(
    $scope, $log, turbineService, widgetService, elasticsearchService) {

    var vm = this;
    var esError = '';
    var regex;

    // TODO select exchange in UI
    var exchange = 'LSE';

    // set to null by default...
    // vm.selectedRic = "";

    // $scope.$watch('search', function (value) {
    //   regex = new RegExp('\\b' + value.escapeRegExp(), 'i');
    // });

    // vm.filterBySearch = function (name) {
    //   if (!$scope.search) {
    //     return true;
    //   }
    //   return regex.test(name);
    // };
    //
    vm.selectRic = function (selectedRic) {
      // TODO using 'vm' here does not work...
      //$scope.selectedRic = selectedRic;
      vm.selectedRic = selectedRic;
      $log.log('select ric: ', selectedRic);
    };

    // fetchStocksFromTheTurbine();
    fetchStocksFromElasticsearch();

    function fetchStocksFromElasticsearch() {
      var promise = elasticsearchService.getTickers();
      widgetService.resolveElasticsearchPromise(promise, loadTickers, onError);
    }

    function loadTickers(results) {
      vm.rics = _.map(results, 'ric');
    }

    function onError(message, err) {
      status = widgetService.status.ERROR;
      var error = 'unable to load rics: {0}: {1}'.format(message, err.message);
      $log.error(error);
      return error;
    }

    function fetchStocksFromTheTurbine() {
      turbineService.stocks(exchange).then(function (response) {
        // console.log(angular.toJson(response.stocks));
        vm.rics = _.map(response.stocks, 'ric');
        // $scope.selectedRic = $scope.symbols[0];
      }, function (err) {
        esError = 'unable to load rics: {0}'.format(err.message);
        $log.error(esError);
      });
    }

  }


})();
