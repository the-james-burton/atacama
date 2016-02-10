(function() {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.turbineService
   * @description
   * # turbineService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')
    .factory('turbineService', turbineService);

    function turbineService(Restangular) {
      var service = {
          symbols: symbols,
          indicators: indicators,
          strategies: strategies
      };
      console.log('turbineService has been created');
      return service;

      function symbols(market) {
        return Restangular.one('turbine').one('stocks').one(market).get();
      };

      function indicators() {
        return Restangular.one('turbine').one('indicators').get();
      };

      function strategies() {
        return Restangular.one('turbine').one('strategies').get();
      };

    }

})();
