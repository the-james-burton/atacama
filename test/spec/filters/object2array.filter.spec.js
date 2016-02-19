'use strict';

describe('Filter: object2array', function () {

  // load the filter's module
  beforeEach(module('atacamaApp'));

  // initialize a new instance of the filter before each test
  var object2arrayFilter;
  beforeEach(inject(function ($filter) {
    object2arrayFilter = $filter('object2array');
  }));

  it('should convert the given object into an array."', function () {
    var text = 'angularjs';
    var result = object2arrayFilter(text);
    _.forEach(text.split(''), function(char){
      expect(result).toContain(char);
    });
  });

});
