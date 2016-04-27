(function() {
  'use strict';

  angular
    .module('atacamaApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, Restangular, securityService) {

    securityService.init();

    // var esError = '';
    // var csrfToken = '';
    // var authorization = 'Basic ' + btoa('user:password1');
    //
    // Restangular.setDefaultHttpFields({withCredentials: true})
    // Restangular.setFullResponse(true);
    // Restangular.setDefaultHeaders({'Authorization': authorization });
    //
    // Restangular.one('user').get().then(function (response) {
    //   // $log.info($cookies.get('JSESSIONID'));
    //   // $log.info($cookies.get('XSRF-TOKEN'));
    //   // $log.info(response.headers)
    //   csrfToken = response.data.details.sessionId;
    //   Restangular.setDefaultHeaders({
    //     'X-XSRF-TOKEN': csrfToken,
    //     'Authorization': authorization,
    //     'X-Requested-With': 'XMLHttpRequest'
    //   });
    //   Restangular.setFullResponse(false);
    // }, function (err) {
    //   esError = 'unable to call /user: {0}:{1}:{2}'.format(authorization, err.status, err.statusText);
    //   $log.error(esError);
    // });

    // $log.debug('runBlock end');
  }

})();
