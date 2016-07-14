(function () {

  'use strict';

  angular.module('atacamaApp').directive('symbolPicker', symbolPickerDirective);

  function symbolPickerDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/symbolPicker/symbol.picker.html',
      link: linkFunc,
      controller: 'SymbolPickerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        selectedSymbol: '='
      }
    };
  }

  function linkFunc(scope, element, attrs, vm) {
    // copy value from vm to local scope...
    scope.selectedSymbol = vm.selectedSymbol;
  }

})();
