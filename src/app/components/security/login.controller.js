(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:LoginController
   * @description
   * # LoginController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('LoginController', LoginController);

  function LoginController($log, $rootScope, $http, $location, $route, securityService, turbineService) {

    var vm = this;
    var tsError = '';

    // vm.tab = function (route) {
    //   return $route.current && route === $route.current.controller;
    // };

    turbineService.user().then(function (response) {
    }, function (err) {
      tsError = 'turbine service is not available: {0}'.format(err.message);
      vm.error = true;
      $rootScope.authenticated = false;
    });

    securityService.login();

    vm.credentials = {};
    vm.login = function () {
      securityService.login(vm.credentials.username, vm.credentials.password, function (authenticated) {
        if (authenticated) {
          $log.info("Login succeeded");
          $location.path("/");
          vm.error = false;
          $rootScope.authenticated = true;
        } else {
          $log.info("Login failed");
          $location.path("/login");
          vm.error = true;
          $rootScope.authenticated = false;
        }
      })
    };

    vm.logout = function () {
      $http.post('logout', {}).finally(function () {
        $rootScope.authenticated = false;
        $location.path("/");
      });
    }

    $log.debug('LoginController has been created');

  }

})();
