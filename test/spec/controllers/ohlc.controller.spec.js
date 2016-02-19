'use strict';

describe('Controller: OhlcCtrl', function () {

  // load the controller's module
  beforeEach(module('atacamaApp'));

  var OhlcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OhlcCtrl = $controller('OhlcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
