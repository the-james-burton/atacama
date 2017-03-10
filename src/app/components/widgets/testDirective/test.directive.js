(function () {

  'use strict';

  angular.module('atacamaApp').directive('testDirective', testDirective);

  function testDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/testDirective/test.html',
      link: linkFunc,
      // controller: 'RicPickerController',
      // controllerAs: 'vm',
      // bindToController: true,
      scope: {
        selectedRic: '=selectedRic'
      }
    };
  }

  function linkFunc(scope, element, attrs) {
    // set to null by default...
    // scope.symbol = "";
  }

})();
