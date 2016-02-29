(function() {
  'use strict';

  angular
    .module('atacamaApp')
    .config(routeConfig);

  function routeConfig($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .when('/dashboard', {
        templateUrl: 'app/components/dashboard/dashboard.html',
        // template: '<atacama-dashboard></atacama-dashboard>'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

})();
