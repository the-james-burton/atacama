'use strict';

describe('Filter: object2Arrayr', function () {

  // load the filter's module
  beforeEach(module('atacamaApp'));

  // initialize a new instance of the filter before each test
  var object2ArrayFilter;
  beforeEach(inject(function ($filter) {
    object2ArrayFilter = $filter('object2Array');
  }));

  it('should convert the given object into an array."', function () {
    var text = 'angularjs';
    var result = object2ArrayFilter(text);
    _.forEach(text.split(''), function(char){
      expect(result).toContain(char);
    });
  });

});
