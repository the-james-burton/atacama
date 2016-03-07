(function () {

  'use strict';

  angular.module('atacamaApp').directive('atacamaIndicator', indicatorDirective);

  function indicatorDirective() {
    return {
      templateUrl: 'app/components/widgets/indicator/indicator.html',
      link: linkFunc,
      controller: 'IndicatorWidgetController',
      controllerAs: 'vm',
      bindToController: true // because the scope is isolated

    };
  }

  function linkFunc(scope, element, attrs) {
    //set to null by default so images will not try to load until the data is returned
    scope.selectedLocation = null;
    scope.isLoaded = false;
    scope.hasError = false;
    // scope.offsetParent = element.offsetParent();
  }

})();
