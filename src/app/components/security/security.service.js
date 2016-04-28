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

  function securityService(Restangular, $log) {
    var service = {
      login: login
    };

    function login(username, password, callback) {
      var esError = '';
      var csrfToken = '';
      var authorization = 'Basic ' + btoa('{0}:{1}'.format(username, password));

      Restangular.setDefaultHttpFields({
        withCredentials: true
      })
      Restangular.setFullResponse(true);
      Restangular.setDefaultHeaders({
        'Authorization': authorization,
        'X-Requested-With': 'XMLHttpRequest'
      });

      Restangular.one('user').get().then(function (response) {
        // $log.info($cookies.get('JSESSIONID'));
        // $log.info($cookies.get('XSRF-TOKEN'));
        // $log.info(response.headers)
        csrfToken = response.data.details.sessionId;
        Restangular.setDefaultHeaders({
          'X-XSRF-TOKEN': csrfToken,
          'Authorization': authorization,
          'X-Requested-With': 'XMLHttpRequest'
        });
        Restangular.setFullResponse(false);
        callback && callback(true);
      }, function (err) {
        esError = 'unable to call /user: {0}:{1}:{2}'.format(authorization, err.status, err.statusText);
        $log.error(esError);
        callback && callback(false);
      });
    }

    $log.debug('securityService has been created');
    return service;

  }

})();
