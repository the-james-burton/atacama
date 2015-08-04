'use strict';

/**
 * @ngdoc service
 * @name atacamaApp.tickService
 * @description
 * # tickService
 * Service in the atacamaApp.
 */
angular.module('atacamaApp')
    .service('tickService', function($rootScope, $stomp) {
        // AngularJS will instantiate a singleton by calling "new" on this function
        console.log('tickService has been created');

        $stomp
            .connect('http://localhost:48002/ticks', [])

        // frame = CONNECTED headers
        .then(function(frame) {
            console.log('connected to tick websocket');
            var subscription = $stomp.subscribe('/topic/ticks', function(payload, headers, res) {
                // alert(payload.message);
                $rootScope.ticks[0].values.push(payload);
                $rootScope.$apply();
            }, {
                "headers": "are awesome"
            });

        });


        // {"date": 1437583864374, "open": 100.0, "high": 100.24021489109903, "low": 98.2724267098159, "close": 99.51909089116204, "volume": 107.79215866544341, "symbol": "ABC.L", "exchange": "FTSE100", "timestamp": "2015-07-22T17:52:04.377+01:00" }
        $rootScope.ticks = [{
            key: "Stock Price",
            values: []
        }];

        this.list = function() {
            return $rootScope.ticks;
        };

        // this.add = function(tick) {
        //    ticks.push(tick);
        //};

    });
