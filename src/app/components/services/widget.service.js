(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.WidgetService
   * @description
   * # widgetService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')
    .factory('widgetService', widgetService);

  function widgetService($log) {
    var service = {
    };

    $log.debug('widgetService has been created');
    return service;

  }

})();
