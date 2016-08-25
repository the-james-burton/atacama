(function () {
  'use strict';

  angular
    .module('atacamaApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $cookies, $log, Restangular, securityService, $location) {

    var testObject = {
      one : {
        prop : 'hello'
      },
      two : {
        prop : 'world'
      }
    };

    $log.info('test:{0} {1}'.format(testObject['one'].prop, testObject['two'].prop));

    // keep user logged in after page refresh
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.authorization) {
      Restangular.setDefaultHeaders($rootScope.globals.headers);
    }

    // http://jasonwatmore.com/post/2015/03/10/AngularJS-User-Registration-and-Login-Example.aspx
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      // redirect to login page if not logged in and trying to access a restricted page
      var path = $location.path();
      var isSecuredPage = !_.includes(['/login', '/register'], path);
      var loggedIn = $rootScope.globals.authorization;
      if (isSecuredPage && !loggedIn) {
        $location.path('/login/false');
      }
    });


    // securityService.login('user', 'password');

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

    $log.debug('runBlock end');
  }

})();
