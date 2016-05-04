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

  function LoginController($log, $rootScope, $routeParams, $cookies, $location, $route, securityService, turbineService) {

    var vm = this;

    var authenticate = function (authenticated, message) {
      vm.authenticated = authenticated;
      $rootScope.authenticated = false;
      vm.message = message;
    };

    vm.authenticated = false;
    vm.available = true;

    $log.info("$routeParams:{0}".format(angular.toJson($routeParams)));

    // already logged in?
    $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.authorization) {
      authenticate(true, "You are already logged in");
    }


    // vm.tab = function (route) {
    //   return $route.current && route === $route.current.controller;
    // };


    turbineService.user().then(function (response) {}, function (err) {
      // only detect if the service is unavailable, other erroes such as 401/403 are deliberately ignored...
      if (err.status === -1) {
        authenticate(false, 'The turbine service is not available');
        vm.available = false;
        vm.message = 'The turbine service is not available';
      }
    });

    // securityService.login();

    vm.credentials = {};
    vm.login = function () {
      securityService.login(vm.credentials.username, vm.credentials.password, function (authenticated) {
        if (authenticated) {
          $log.info("Login succeeded");
          $location.path("/dashboard");
          authenticate(true);
        } else {
          authenticate(false, "Login Failed. Please try again.");
          $log.info("Login failed");
          $location.path("/login/false");
        }
      });
    };

    vm.logout = function () {
      authenticate(false, 'You have logged out.');
      $cookies.remove('globals');
      $log.info("Logged out");
      $location.path("/");
    };

    if ($routeParams.logout === 'true') {
      vm.logout();
    }


    $log.debug('LoginController has been created');

  }

})();
