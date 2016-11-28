(function () {

  'use strict';

  angular.module('atacamaApp').directive('tickerPicker', tickerPickerDirective);

  function tickerPickerDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/tickerPicker/ticker.picker.html',
      link: linkFunc,
      controller: 'TickerPickerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        selectedTicker: '='
      }
    };
  }

  function linkFunc(scope, element, attrs, vm) {
    // copy value from vm to local scope...
    scope.selectedTicker = vm.selectedTicker;
  }

})();
