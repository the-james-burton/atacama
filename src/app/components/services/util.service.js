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
      traceLog: traceLog,
      unsubscribeTopic: unsubscribeTopic
    };

    function traceLog(item, text) {
      $log.debug("{0}.{1}.{2} {3}".format(
        item.title, item.settings.row, item.settings.col, text));
    }

    function unsubscribeTopic(topic) {
      if (topic.length > 0) {
        ngstomp.unsubscribe(topic, A.unsubscribeCallback(topic));
      }
    }

    $log.debug('utilService has been created');
    return service;

  }

})();
