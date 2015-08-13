'use strict';

describe('Controller: WidgetCtrl', function () {

  // load the controller's module
  beforeEach(module('atacamaApp'));

  var WidgetCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WidgetCtrl = $controller('WidgetCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  //it('should attach a list of awesomeThings to the scope', function () {
    //expect(WidgetCtrl.awesomeThings.length).toBe(3);
  //});
});
