'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:TestCtrl
 * @description
 * # TestCtrl
oller of the atacamaApp
 */
angular.module('atacamaApp')
    .controller('TestCtrl', function($scope, $stomp, Restangular) {
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


        // redirect debug
        $stomp.setDebug(function(args) {
            document.getElementById('log').value += args + '\n';
        });

        $stomp
            .connect('http://localhost:48002/reply', [])

        // frame = CONNECTED headers
        .then(function(frame) {

            var subscription = $stomp.subscribe('/topic/reply', function(payload, headers, res) {
                // alert(payload.message);
                $scope.testReply = payload.message;
                $scope.$apply();
                // processReply(payload.message);
                subscription.unsubscribe();
                $stomp.disconnect(function() {
                });
            }, {
                "headers": "are awesome"
            });

            // Send message
            $stomp.send('/app/reply', {
                message: 'atacama test page'
            }, {
                priority: 9,
                custom: 42 //Custom Headers
            });

        });

    });
