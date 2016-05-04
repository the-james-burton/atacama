(function() {
  'use strict';

  angular
    .module('atacamaApp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, RestangularProvider, ngstompProvider) {

    // var url = 'http://localhost:48002/ticks';
    var stompUrl = 'http://localhost:15674/stomp';
    var csrfToken = "";

    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    RestangularProvider.setBaseUrl('https://localhost:48002');

    // https://www.rabbitmq.com/web-stomp.html
    // Missing features
    // RabbitMQ-Web-Stomp is fully compatible with the RabbitMQ-STOMP plugin, with the exception of STOMP heartbeats.
    // STOMP heartbeats won't work with SockJS.
    ngstompProvider
        .url(stompUrl)
        .credential('guest', 'guest')
        .debug(true)
        .heartbeat(0, 0)
        .vhost('/')
        .class(SockJS);

  }

})();
