(function () {

  'use strict';

  angular.module('atacamaApp').directive('datePicker', datePickerDirective);

  function datePickerDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/datePicker/date.picker.html',
      link: linkFunc,
      controller: 'DatePickerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        selectedDate: '='
      }
    };
  }

  function linkFunc(scope, element, attrs, vm) {
    // copy value from vm to local scope...
    scope.selectedDate = vm.selectedDate;
  }

})();
