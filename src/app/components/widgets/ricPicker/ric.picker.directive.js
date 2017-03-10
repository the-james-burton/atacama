(function () {

  'use strict';

  angular.module('atacamaApp').directive('ricPicker', ricPickerDirective);

  function ricPickerDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/ricPicker/ric.picker.html',
      link: linkFunc,
      controller: 'RicPickerController',
      controllerAs: 'vm',
      bindToController: true,
      scope: {
        selectedRic: '='
      }
    };
  }

  function linkFunc(scope, element, attrs, vm) {
    // copy value from vm to local scope...
    scope.selectedRic = vm.selectedRic;
  }

})();
