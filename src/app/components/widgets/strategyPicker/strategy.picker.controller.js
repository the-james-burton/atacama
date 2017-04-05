(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:StrategyPickerController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('StrategyPickerController', StrategyPickerController);

  function StrategyPickerController(
    $scope, $log, turbineService) {

    var vm = this;
    var esError = '';
    var regex;

    // TODO select exchange in UI
    var exchange = 'LSE';

    vm.selectStrategy = function (selectedStrategy) {
      // TODO using 'vm' here does not work...
      // $scope.selectedStrategy = selectedStrategy;
      vm.selectedStrategy = selectedStrategy;
      $log.log('select strategy: ', selectedStrategy);
    };

    fetchStrategies();

    function fetchStrategies() {
      turbineService.strategies().then(function (response) {
        vm.strategies = response.strategies;
      }, function (err) {
        esError = 'unable to load strategies: {0}'.format(err.message);
        $log.error(esError);
      });
    }
  }


})();
