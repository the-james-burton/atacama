'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.turbineService
 * @description
 * # turbineService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
  .service('turbineService', function (Restangular) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    this.symbols = function(market) {
      return Restangular.one('turbine').one('stocks').one(market).get();
    };

    this.indicators = function() {
      return Restangular.one('turbine').one('indicators').get();
    };

    this.strategies = function() {
      return Restangular.one('turbine').one('strategies').get();
    };

  });
