(function () {
  'use strict';

  describe('service utilService', function () {
    var utilService;
    var $log;

    beforeEach(module('atacamaApp', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function (_utilService_, _$log_) {
      utilService = _utilService_;
      $log = _$log_;
    }));

    it('should be registered', function () {
      expect(utilService).not.toEqual(null);
    });

  });
})();
