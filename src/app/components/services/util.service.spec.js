(function () {
  'use strict';

  describe('service utilService', function () {
    var utilService;

    beforeEach(module('atacamaApp'));
    beforeEach(inject(function (_utilService_) {
      utilService = _utilService_;
    }));

    it('should be registered', function () {
      expect(utilService).not.toEqual(null);
    });

  });
})();
