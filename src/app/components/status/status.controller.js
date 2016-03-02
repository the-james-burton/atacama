(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:StatusCtrl
   * @description
   * # StatusCtrl controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('StatusController', function ($scope, ngstomp, Restangular) {
      console.log('StatusController has been created');
      var vm = this;

      vm.statusReply = 'reply goes here';

      vm.greeting = {
        text: 'hello world!',
        time: moment(),
        sod: moment(0, "HH").format("x"),
        milli: moment().format("x")
      };

      vm.greeting.ping = 'ping!';

      var ping = Restangular.one('/tick/ping');

      ping.get().then(function (reply) {
        vm.greeting.ping = reply.time;
      });

      ngstomp
        .subscribe('/topic/reply', onReply, {}, $scope);

      function onReply(message) {
        vm.statusReply = message.body;
        $scope.$apply();
      }

      var objectToSend = {
          message: 'atacama status page'
        },
        stompHeaders = {
          headers1: 'xx',
          headers2: 'yy'
        };

      // $scope.sendDataToWS = function(message) {
      ngstomp
        .send('/amq/queue/request', objectToSend, stompHeaders);
      // };

      /*
              $stomp
                  .connect('http://localhost:48002/reply', [])
              .then(function(frame) {

                  var subscription = $stomp.subscribe('/topic/reply', function(payload, headers, res) {
                      $scope.statusReply = payload.message;
                      $scope.$apply();
                      subscription.unsubscribe();
                      $stomp.disconnect(function() {
                      });
                  }, {
                      "headers": "are awesome"
                  });
      */


      // Send message
      // $stomp.send('/app/reply', {
      //     message: 'atacama status page'
      // }, {
      //     priority: 9,
      //     custom: 42 //Custom Headers
      // });

      // });

    });
})();
