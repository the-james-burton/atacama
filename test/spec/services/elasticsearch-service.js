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

  var sod = moment(0, "HH").format("x");

  var keyValueTuple1 = ['my-key1', 'my-value1'];
  var keyValueTuple2 = ['my-key2', 'my-value2'];

  var requiredQueries = function() {
    var arrayOfKeyValueTuples = [];
    arrayOfKeyValueTuples.push(keyValueTuple1);
    arrayOfKeyValueTuples.push(keyValueTuple2);
    return arrayOfKeyValueTuples;
  };

  it('should join many elasticsearch query_strings into an array', function () {
    var input = requiredQueries();
    var result = elasticsearchService.createQueryStrings(input);
    console.log(JSON.stringify(result));

    expect(result[0].query_string.query).toEqual(keyValueTuple1[0]);
    expect(result[0].query_string.fields).toContain(keyValueTuple1[1]);
    expect(result[1].query_string.query).toEqual(keyValueTuple2[0]);
    expect(result[1].query_string.fields).toContain(keyValueTuple2[1]);
  });

  it('should convert elasticsearch query_strings into an query', function () {
    var input = requiredQueries();
    var queryStrings = elasticsearchService.createQueryStrings(input);
    var result = elasticsearchService.createQueries(queryStrings, sod);

    //console.log(JSON.stringify(result));
    console.log(JSON.stringify(result[0]));
    expect(result[0].query_string.query).toEqual(keyValueTuple1[0]);
    expect(result[0].query_string.fields).toContain(keyValueTuple1[1]);
    expect(result[1].query_string.query).toEqual(keyValueTuple2[0]);
    expect(result[1].query_string.fields).toContain(keyValueTuple2[1]);
    expect(result[2].range.date.from).toEqual(sod);
  });

});
