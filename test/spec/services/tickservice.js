'use strict';

describe('Service: tickService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var tickService;
  beforeEach(inject(function (_tickService_) {
    tickService = _tickService_;
  }));

  it('should do something', function () {
    expect(!!tickService).toBe(true);
  });

});
