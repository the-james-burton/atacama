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

  it('should return something', function () {
    expect(elasticsearchService.testReply("jasmine")).toEqual("hello jasmine");
  });

  it('should create an elasticsearch query string', function () {
    var key = 'my-key';
    var value = 'my-value';
    var expected = {query_string: {query: key, fields: [value]}};
    expect(elasticsearchService.createQueryString(key, value)).toEqual(expected);
    console.log(JSON.stringify(expected));
  });

  it('should join many elasticsearch query strings into an array', function () {
    var keyValueTuple1 = ['my-key1', 'my-value1'];
    var keyValueTuple2 = ['my-key2', 'my-value2'];
    var arrayOfKeyValueTuples = [];
    arrayOfKeyValueTuples.push(keyValueTuple1);
    arrayOfKeyValueTuples.push(keyValueTuple2);

    var expected = [];
    expected.push(elasticsearchService.createQueryString(keyValueTuple1[0], keyValueTuple1[1]));
    expected.push(elasticsearchService.createQueryString(keyValueTuple2[0], keyValueTuple2[1]));

    expect(elasticsearchService.createQueryStrings(arrayOfKeyValueTuples)).toEqual(expected);
    console.log(JSON.stringify(expected));
  });

});
