'use strict';

describe('Service: elasticsearchService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var elasticsearchService;
  beforeEach(inject(function (_elasticsearchService_) {
    elasticsearchService = _elasticsearchService_;
  }));

  it('should do something', function () {
    expect(!!elasticsearchService).toBe(true);
  });

});
