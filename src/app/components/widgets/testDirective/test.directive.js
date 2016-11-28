(function () {

  'use strict';

  angular.module('atacamaApp').directive('testDirective', testDirective);

  function testDirective() {
    return {
      // require: '?ngModel',
      // require: '^^turbineService',
      templateUrl: 'app/components/widgets/testDirective/test.html',
      link: linkFunc,
      // controller: 'TickerPickerController',
      // controllerAs: 'vm',
      // bindToController: true,
      scope: {
        selectedTicker: '=selectedTicker'
      }
    };
  }

  function linkFunc(scope, element, attrs) {
    // set to null by default...
    // scope.symbol = "";
  }

})();
