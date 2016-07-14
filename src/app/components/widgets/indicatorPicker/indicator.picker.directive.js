(function () {

  'use strict';

  angular.module('atacamaApp').directive('indicatorPicker', indicatorPickerDirective);

  function indicatorPickerDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/indicatorPicker/indicator.picker.html',
      link: linkFunc,
      controller: 'IndicatorPickerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        selectedIndicator: '='
      }
    };
  }

  function linkFunc(scope, element, attrs, vm) {
    // copy value from vm to local scope...
    scope.selectedIndicator = vm.selectedIndicator;
  }

})();
