(function() {
  'use strict';

  angular
    .module('atacamaApp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, RestangularProvider, ngstompProvider) {

    // var url = 'http://localhost:48002/ticks';

    // https://www.rabbitmq.com/web-stomp.html
    // The /ws is the websocket url according to the does, but it does not seem to exist
    // However, using /stomp does actually result in a websocket connection...
    // var stompUrl = 'https://localhost:15671/stomp';
    // NOTE: not connecting to RabbitMQ as stomp broker due to https://github.com/the-james-burton/the-turbine/issues/23
    // var stompUrl = 'http://localhost:15674/stomp';

    // to use the stomp support builT into RabbitMQ...
    // NOTE: not using this due to https://github.com/the-james-burton/the-turbine/issues/24
    var stompUrl = 'http://localhost:48002/ticks';

    var csrfToken = "";

    // Enable log
    $logProvider.debugEnabled(true);

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;

    // RestangularProvider.setBaseUrl('https://localhost:48002');
    RestangularProvider.setBaseUrl('http://localhost:48002');

    // Missing features from RabbitMQ webstomp...
    // RabbitMQ-Web-Stomp is fully compatible with the RabbitMQ-STOMP plugin, with the exception of STOMP heartbeats.
    // STOMP heartbeats won't work with SockJS.

    // Access-Control-Allow-Credentials:true
    // Access-Control-Allow-Origin:http://localhost:3000

    // NOTE: this does not seem work with credentials when using spring simple broker...

    ngstompProvider
        .url(stompUrl)
        // .credential('guest', 'guest') // for RabbitMQ
        .credential('user', 'password') // for simple stomp broker in spring-boot - this DOES NOT WORK so target is unsecured right now
        .debug(true)
        .heartbeat(0, 0)
        .vhost('/')
        .class(SockJS);

  }

})();
