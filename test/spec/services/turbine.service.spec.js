'use strict';

describe('Service: turbineService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var turbineService;
  beforeEach(inject(function (_turbineService_) {
    turbineService = _turbineService_;
  }));

  it('should do something', function () {
    expect(!!turbineService).toBe(true);
  });

});
