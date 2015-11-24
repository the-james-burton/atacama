'use strict';

describe('Service: chartService', function () {

  // load the service's module
  beforeEach(module('atacamaApp'));

  // instantiate service
  var chartService;
  beforeEach(inject(function (_chartService_) {
    chartService = _chartService_;
  }));

  it('should do something', function () {
    expect(!!chartService).toBe(true);
  });

  it('converts the data', function () {
    var series = [
      { values: [], key: "value1", position: 0 },
      { values: [], key: "value2", position: 1 },
      { values: [], key: "nested.value3", position: 2 }
    ];
    var data = [
      { date: 100, value1: 200, value2: 300, nested: { value3: 400 } },
      { date: 101, value1: 201, value2: 301, nested: { value3: 401 } }
    ];
    var expected0 = [
      {x: 100, y: 200},
      {x: 101, y: 201}
    ];
    var expected1 = [
      {x: 100, y: 300},
      {x: 101, y: 301}
    ];
    var expected2 = [
      {x: 100, y: 400},
      {x: 101, y: 401}
    ];
    chartService.convertData(series, data);
    console.log(series[0].values);
    console.log(series[1].values);
    console.log(series[2].values);
    expect(series[0].values).toEqual(expected0);
    expect(series[1].values).toEqual(expected1);
    expect(series[2].values).toEqual(expected2);
  });


});
