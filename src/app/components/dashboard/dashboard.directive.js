(function () {﻿

  'use strict';

  /** @ngInject */
  angular.module('atacamaApp').directive('atacamaDashboard', function () {
    return {
      // scope: {},
      templateUrl: 'app/components/widgets/ohlc/ohlc.html',
      link: linkFunc,
      controller: 'DashboardController',
      controllerAs: 'vm',
      bindToController: true // because the scope is isolated
    };

    function linkFunc(scope, element, attrs) {
    }

  });

})();
