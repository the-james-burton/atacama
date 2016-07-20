(function () {

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

  function turbineService(Restangular, CacheFactory, $log) {
    var service = {
      user: user,
      symbols: symbols,
      indicators: indicators,
      strategies: strategies
    };

    var turbineCache;

    // Check to make sure the cache doesn't already exist
    if (!CacheFactory.get('turbineCache')) {
      turbineCache = CacheFactory('turbineCache', {
        maxAge: 15 * 60 * 1000, // Items added to this cache expire after 15 minutes.
        cacheFlushInterval: 60 * 60 * 1000, // This cache will clear itself every hour.
        deleteOnExpire: 'aggressive', // Items will be deleted from this cache right when they expire.
        storageMode: 'localStorage' // This cache will use `localStorage`.
      });
    }

    Restangular.addFullRequestInterceptor(function (element, operation, what, url, headers, params, httpConfig) {
      // https://localhost:48002/turbine/stocks/FTSE100
      // https://localhost:48002/turbine/strategies
      // https://localhost:48002/turbine/indicators

      // if requesting /turbine/ URLs with get then we can use the cache...
      if (url.includes('/turbine/') && operation.includes('get')) {
        httpConfig.cache = turbineCache;
      }

      return {
        element: element,
        headers: headers,
        params: params,
        httpConfig: httpConfig
      };

    });

    function user() {
      return Restangular.one('user').get();
    }

    function symbols(market) {
      return Restangular.one('turbine').one('stocks').one(market).get();
    }

    function indicators() {
      return Restangular.one('turbine').one('indicators').get();
    }

    function strategies() {
      return Restangular.one('turbine').one('strategies').get();
    }

    $log.debug('turbineService has been created');
    return service;

  }

})();
