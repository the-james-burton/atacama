(function() {
  'use strict';

  angular
    .module('atacamaApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, Restangular, $rootScope, $cookies) {

    var csrfToken = ""

    Restangular.setDefaultHttpFields({withCredentials: true})
    Restangular.setFullResponse(true);

    Restangular.one('user').get().then(function (response) {
      // $log.info($cookies.get('JSESSIONID'));
      // $log.info($cookies.get('XSRF-TOKEN'));
      // $log.info(response.headers)
      csrfToken = response.data.details.sessionId;
      Restangular.setDefaultHeaders({'X-XSRF-TOKEN': csrfToken}); //CSRF_TOKEN gathered elsewhere
      Restangular.setFullResponse(false);
    });


    // $log.debug('runBlock end');
  }

})();
