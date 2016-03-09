(function () {
  'use strict';

  describe('service turbineService', function () {
    var turbineService;
    var $log;

    beforeEach(module('atacamaApp', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function (_turbineService_, _$log_) {
      turbineService = _turbineService_;
      $log = _$log_;
    }));

    it('should be registered', function () {
      expect(turbineService).not.toEqual(null);
    });

  });
})();
