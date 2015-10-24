'use strict';

describe('Service: elasticsearchService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var tickService;
  beforeEach(inject(function (elasticsearchService) {
    elasticsearchService = _elasticsearchService_;
  }));

  it('should do something', function () {
    expect(!!tickService).toBe(true);
  });

});
