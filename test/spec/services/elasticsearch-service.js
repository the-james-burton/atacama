'use strict';

describe('Service: elasticsearchService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var elasticsearchService;
  beforeEach(inject(function (_elasticsearchService_) {
    elasticsearchService = _elasticsearchService_;
  }));

  var sod = moment(0, "HH").format("x");

  var key1 = 'my-key1';
  var key2 = 'my-key2';
  var value1 = 'my-value1';
  var value2 = 'my-value2';
  var keyValueTuple1 = [key1, value1];
  var keyValueTuple2 = [key2, value2];

  var requiredQueries = function() {
    var arrayOfKeyValueTuples = [];
    arrayOfKeyValueTuples.push(keyValueTuple1);
    arrayOfKeyValueTuples.push(keyValueTuple2);
    return arrayOfKeyValueTuples;
  };

  var checkQueryString = function(result) {
    expect(result[0].query_string.query).toEqual(keyValueTuple1[0]);
    expect(result[0].query_string.fields).toContain(keyValueTuple1[1]);
    expect(result[1].query_string.query).toEqual(keyValueTuple2[0]);
    expect(result[1].query_string.fields).toContain(keyValueTuple2[1]);
  };

  it('should do something', function () {
    expect(!!elasticsearchService).toBe(true);
  });

  it('should return something', function () {
    expect(elasticsearchService.testReply("jasmine")).toEqual("hello jasmine");
  });

  it('should create an elasticsearch query string', function () {
    var expected = {query_string: {query: key1, fields: [value1]}};
    expect(elasticsearchService.createQueryString(key1, value1)).toEqual(expected);
    console.log(JSON.stringify(expected));
  });

  it('should join many elasticsearch query_strings into an array', function () {
    var input = requiredQueries();
    var result = elasticsearchService.createQueryStrings(input);

    console.log(JSON.stringify(result));
    checkQueryString(result);
  });

  it('should convert elasticsearch query_strings into an query', function () {
    var input = requiredQueries();
    var queryStrings = elasticsearchService.createQueryStrings(input);
    var result = elasticsearchService.createQueries(queryStrings, sod);

    console.log(JSON.stringify(result));
    checkQueryString(result);
    expect(result[2].range.date.from).toEqual(sod);
  });

  it('should create a complete elasticsearch query', function () {
    var result = elasticsearchService.createESQuery(requiredQueries(), sod);
    console.log(JSON.stringify(result));

    expect(result.size).toBeDefined();
    expect(result.query).toBeDefined();
    expect(result.query.bool).toBeDefined();
    expect(result.query.bool.must).toBeDefined();
    expect(result.query.bool.must.length).toEqual(3);
  });

});
