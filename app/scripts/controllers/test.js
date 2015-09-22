'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:TestCtrl
 * @description
 * # TestCtrl
oller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('TestCtrl', function($scope, ngstomp, Restangular) {
        console.log('TestCtrl has been created');

        $scope.testReply = 'reply goes here';

        $scope.greeting = {
            text: 'hello world!',
            time: moment(),
            sod: moment(0, "HH").format("x"),
            milli: moment().format("x")
        };

        $scope.greeting.ping = 'ping!';

        var ping = Restangular.one('/tick/ping');

        ping.get().then(function(reply) {
            $scope.greeting.ping = reply.time;
        });

        ngstomp
          .subscribe('/topic/reply', onReply, {}, $scope);

        function onReply(message) {
          $scope.testReply = message.body;
          $scope.$apply();
        }

        var objectToSend = { message : 'atacama test page'},
            stompHeaders = {headers1 : 'xx', headers2 : 'yy'};

        $scope.sendDataToWS = function(message) {
            ngstomp
                .send('/app/reply', objectToSend, stompHeaders);
        };

/*
        $stomp
            .connect('http://localhost:48002/reply', [])
        .then(function(frame) {

            var subscription = $stomp.subscribe('/topic/reply', function(payload, headers, res) {
                $scope.testReply = payload.message;
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
            //     message: 'atacama test page'
            // }, {
            //     priority: 9,
            //     custom: 42 //Custom Headers
            // });

        // });

    });
