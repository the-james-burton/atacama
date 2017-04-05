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
    $scope, $log, turbineService) {

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

    fetchStocks();

    function fetchStocks() {
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
