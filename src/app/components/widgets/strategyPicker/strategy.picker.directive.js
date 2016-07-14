(function () {

  'use strict';

  angular.module('atacamaApp').directive('strategyPicker', strategyPickerDirective);

  function strategyPickerDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/strategyPicker/strategy.picker.html',
      link: linkFunc,
      controller: 'StrategyPickerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        selectedStrategy: '='
      }
    };
  }

  function linkFunc(scope, element, attrs, vm) {
    // copy value from vm to local scope...
    scope.selectedStrategy = vm.selectedStrategy;
  }

})();
