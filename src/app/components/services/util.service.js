(function () {

  'use strict';

  /**
   * @ngdoc service
   * @name atacamaApp.utilService
   * @description
   * # utilService
   * Service in the atacamaApp.
   */
  angular.module('atacamaApp')
    .factory('utilService', utilService);

  function utilService($log, ngstomp) {
    var service = {
      traceLog: traceLog
    };

    function traceLog(item, text) {
      $log.debug("{0}.{1}.{2} {3}".format(
        item.title, item.settings.row, item.settings.col, text));
    }

    $log.debug('utilService has been created');
    return service;

  }

})();
