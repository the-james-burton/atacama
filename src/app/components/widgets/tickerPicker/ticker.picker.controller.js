(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:TickerPickerController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('TickerPickerController', TickerPickerController);

  function TickerPickerController(
    $scope, $log, turbineService) {

    var vm = this;
    var esError = '';
    var regex;

    // TODO select exchange in UI
    var exchange = 'LSE';

    // set to null by default...
    // vm.selectedTicker = "";

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
    vm.selectTicker = function (selectedTicker) {
      // TODO using 'vm' here does not work...
      $scope.selectedTicker = selectedTicker;
      vm.selectedTicker = selectedTicker;
      $log.log('select ticker: ', selectedTicker);
    };

    fetchStocks();

    function fetchStocks() {
      turbineService.stocks(exchange).then(function (response) {
        // console.log(angular.toJson(response.stocks));
        vm.tickers = _.map(response.stocks, 'ticker');
        // $scope.selectedTicker = $scope.symbols[0];
      }, function (err) {
        esError = 'unable to load tickers: {0}'.format(err.message);
        $log.error(esError);
      });
    }

  }


})();
