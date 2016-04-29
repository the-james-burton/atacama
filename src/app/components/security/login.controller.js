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

    // vm.tab = function (route) {
    //   return $route.current && route === $route.current.controller;
    // };

    turbineService.user().then(function (response) {
    }, function (err) {
      // only detect if the service is unavailable, other erroes such as 401/403 are deliberately ignored...
      if (err.status === -1) {
        vm.message = 'The turbine service is not available';
        $rootScope.authenticated = false;
      }
    });

    // securityService.login();

    vm.credentials = {};
    vm.login = function () {
      securityService.login(vm.credentials.username, vm.credentials.password, function (authenticated) {
        if (authenticated) {
          $log.info("Login succeeded");
          $location.path("/");
          vm.message = null;
          $rootScope.authenticated = true;
        } else {
          $log.info("Login failed");
          $location.path("/login");
          vm.message = "Login Failed. Please try again.";
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
