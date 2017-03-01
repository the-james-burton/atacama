(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:IndicatorPickerController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('IndicatorPickerController', IndicatorPickerController);

  function IndicatorPickerController(
    $scope, $log, turbineService) {

    var vm = this;
    var esError = '';
    var regex;

    // TODO select exchange in UI
    var exchange = 'LSE';

    vm.selectIndicator = function (selectedIndicator) {
      // TODO using 'vm' here does not work...
      $scope.selectedIndicator = selectedIndicator;
      vm.selectedIndicator = selectedIndicator;
      $log.log('select indicator: ', selectedIndicator);
    };

    fetchIndicators();

    function fetchIndicators() {
      turbineService.indicators().then(function (response) {
        vm.indicators = response.indicators;
      }, function (err) {
        esError = 'unable to load indicators: {0}'.format(err.message);
        $log.error(esError);
      });
    }


  }


})();
