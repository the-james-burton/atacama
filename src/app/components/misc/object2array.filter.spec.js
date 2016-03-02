(function() {
  'use strict';

  describe('Filter: object2array', function () {
    var object2arrayFilter;

    beforeEach(module('atacamaApp'));
    beforeEach(inject(function ($filter) {
      object2arrayFilter = $filter('object2array');
    }));

    it('should be registered', function() {
      expect(object2arrayFilter).not.toEqual(null);
    });

    it('should convert the given object into an array."', function () {
      var text = 'angularjs';
      var result = object2arrayFilter(text);
      _.forEach(text.split(''), function(char){
        expect(result).toContain(char);
      });
    });

  });
})();
