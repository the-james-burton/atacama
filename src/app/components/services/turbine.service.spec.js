(function () {
  'use strict';

  describe('service turbineService', function () {
    var turbineService;

    beforeEach(module('atacamaApp'));
    beforeEach(inject(function (_turbineService_) {
      turbineService = _turbineService_;
    }));

    it('should be registered', function () {
      expect(turbineService).not.toEqual(null);
    });

  });
})();
