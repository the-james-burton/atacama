(function () {
  'use strict';

  describe('service widgetService', function () {
    var widgetService;
    var $log;

    beforeEach(module('atacamaApp', function ($provide) {
      $provide.value('$log', console);
    }));

    beforeEach(inject(function (_widgetService_, _$log_) {
      widgetService = _widgetService_;
      $log = _$log_;
    }));

    it('should be registered', function () {
      expect(widgetService).not.toEqual(null);
    });

  });
})();
