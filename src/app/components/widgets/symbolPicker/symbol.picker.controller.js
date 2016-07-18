(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:SymbolPickerController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('SymbolPickerController', SymbolPickerController);

  function SymbolPickerController(
    $scope, $log, turbineService) {

    var vm = this;
    var esError = '';
    var regex;

    // TODO select market in UI
    var market = 'FTSE100';

    // set to null by default...
    // vm.selectedSymbol = "";

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
    vm.selectSymbol = function (selectedSymbol) {
      // TODO using 'vm' here does not work...
      $scope.selectedSymbol = selectedSymbol;
      vm.selectedSymbol = selectedSymbol;
      $log.log('select symbol: ', selectedSymbol);
    };

    fetchStocks();

    function fetchStocks() {
      turbineService.symbols(market).then(function (response) {
        // console.log(angular.toJson(response.stocks));
        vm.symbols = _.map(response.stocks, 'symbol');
        // $scope.selectedSymbol = $scope.symbols[0];
      }, function (err) {
        esError = 'unable to load symbols: {0}'.format(err.message);
        $log.error(esError);
      });
    }

  }


})();
