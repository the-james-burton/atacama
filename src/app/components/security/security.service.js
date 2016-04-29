(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.securityService
   * @description
   * # securityService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')
    .factory('securityService', securityService);

  function securityService($rootScope, Restangular, $log, $cookies) {
    var service = {
      login: login
    };

    function login(username, password, callback) {
      var esError = '';
      var csrfToken = '';
      var authorization = 'Basic ' + btoa('{0}:{1}'.format(username, password));
      var headers = {
        'Authorization': authorization,
        'X-Requested-With': 'XMLHttpRequest'
      };

      Restangular.setDefaultHttpFields({
        withCredentials: true
      })
      Restangular.setFullResponse(true);
      Restangular.setDefaultHeaders(headers);

      Restangular.one('user').get().then(function (response) {
        // $log.info($cookies.get('JSESSIONID'));
        // $log.info($cookies.get('XSRF-TOKEN'));
        // $log.info(response.headers)
        csrfToken = response.data.details.sessionId;
        headers = _.merge(headers, {
          'X-XSRF-TOKEN': csrfToken
        });
        $log.info(headers);
        Restangular.setDefaultHeaders(headers);
        Restangular.setFullResponse(false);
        $rootScope.globals = {
          authorization: authorization,
          headers: headers
        };
        // we don't need this as we set it via Restangular instead...
        // $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
        $cookies.putObject('globals', $rootScope.globals);
        $log.info($cookies.get('globals'));
        callback && callback(true);
      },
      function (err) {
        esError = 'unable to call /user: {0}:{1}:{2}'.format(authorization, err.status, err.statusText);
        $log.error(esError);
        callback && callback(false);
      });
    }

    $log.debug('securityService has been created');
    return service;

  }

})();
