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

    function LoginController($log, $rootScope, $cookies, $http, $location, $route, securityService, turbineService) {

      var vm = this;

      var authenticate = function(authenticated, message) {
        vm.authenticated = authenticated;
        $rootScope.authenticated = false;
        vm.message = message;
        vm.authenticated = true;
      };

      vm.authenticated = false;

      // already logged in?
      $rootScope.globals = $cookies.getObject('globals') || {};
      if ($rootScope.globals.authorization) {
        authenticate(true, "You are already logged in");
      }


      // vm.tab = function (route) {
      //   return $route.current && route === $route.current.controller;
      // };

      turbineService.user().then(function (response) {
      }, function (err) {
        // only detect if the service is unavailable, other erroes such as 401/403 are deliberately ignored...
        if (err.status === -1) {
          authenticate(false, 'The turbine service is not available');
          vm.message = 'The turbine service is not available';
        }
      });

      // securityService.login();

      vm.credentials = {};
      vm.login = function () {
        securityService.login(vm.credentials.username, vm.credentials.password, function (authenticated) {
          if (authenticated) {
            $log.info("Login succeeded");
            $location.path("/");
            authenticate(true);
          } else {
            $log.info("Login failed");
            $location.path("/login");
            authenticate(true, "Login Failed. Please try again.");
          }
        })
      };

      vm.logout = function () {
        $http.post('logout', {}).finally(function () {
          authenticate(false, 'You have logged out.');
          $cookies.remove('globals');
          $location.path("/");
        });
      }

      $log.debug('LoginController has been created');

    }

  })();
