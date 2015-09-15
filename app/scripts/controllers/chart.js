'use strict';

/**
 * @ngdoc function
 * @name atacamaApp.controller:ChartCtrl
 * @description
 * # ChartCtrl
 * Controller of the atacamaApp
 */
angular.module('atacamaApp')
  .controller('ChartCtrl', function ($scope, $stomp, $resource, tickService, Restangular) {
    console.log('ChartCtrl has been created');

    var url = 'http://localhost:48002';

    var sod = moment(0, "HH").format("x");

    // {"date": 1437583864374, "open": 100.0, "high": 100.24021489109903, "low": 98.2724267098159, "close": 99.51909089116204, "volume": 107.79215866544341, "symbol": "ABC.L", "exchange": "FTSE100", "timestamp": "2015-07-22T17:52:04.377+01:00" }

    var exchange = 'FTSE100';
    var symbol = 'ABC';


    $stomp
      .connect(url + '/ticks', [])

      // frame = CONNECTED headers
      .then(function (frame) {
        console.log('connected to tick websocket');
        var subscription = $stomp.subscribe('/topic/ticks.' + exchange + '.' + symbol, function (payload, headers, res) {
          // alert(payload.close);
          // var point = {x: payload.date, y: payload.close};
          var open = _.map([payload], _.curry(convertTicks)('open'));
          var high = _.map([payload], _.curry(convertTicks)('high'));
          var low = _.map([payload], _.curry(convertTicks)('low'));
          var close = _.map([payload], _.curry(convertTicks)('close'));

          $scope.data[0].values.push(open);
          $scope.data[1].values.push(high);
          $scope.data[2].values.push(low);
          $scope.data[3].values.push(close);
          $scope.$apply();
        }, {
          "headers": "are awesome"
        });

      });
//dummy
    // $scope.data = sinAndCos();

    var open = [],
        high = [],
        low = [],
        close = [];

    $scope.data = [
          {
              values: open,
              key: "open",
              color: "#bdc42d"
          },
          {
              values: high,
              key: "high",
              color: "#2ca02c"
          },
          {
              values: low,
              key: "low",
              color: "#9f442c"
          },
          {
              values: close,
              key: "close",
              color: "#2c649f"
          }
        ];


    function convertTicks(property, ticks) {
     return _(ticks).pick([property, 'date']).mapKeys(renameProperties).value();
    }

    function renameProperties(value, key) {
      switch (key) {
        case 'open':
        case 'close':
        case 'high':
        case 'low':
          return 'y';
        case 'date':
          return 'x'
        default:
          return 'unknown';
     }
     return key;
   }

    var ticks = Restangular.one('tick').one(symbol).one(sod);

    ticks.get().then(function (response) {
     // $scope.data[0].values = response.ticks;

     console.log("original ticks:" + JSON.stringify(response.ticks));

     $scope.data[0].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('open')), 'x');
     $scope.data[1].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('high')), 'x');
     $scope.data[2].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('low')), 'x');
     $scope.data[3].values = _.sortBy(_.map(response.ticks, _.curry(convertTicks)('close')), 'x');

    });


    $scope.options = {
      chart: {
        type: 'lineChart',
        height: 450,
        margin: {
          top: 20,
          right: 20,
          bottom: 50,
          left: 75
        },
        // x: function (d) {
        //   return d['date'];
        // },
        // y: function (d) {
        //  return d['close'];
        // },
        showValues: true,
        transitionDuration: 500,
        xAxis: {
          axisLabel: 'Dates',
          tickFormat: function (d) {
            return d3.time.format('%X')(new Date(d));
          },
        },
        yAxis: {
          axisLabel: 'Stock Price',
          tickFormat: function (d, i) {
            return '$' + d3.format(',.1f')(d);
          }
        }
      }
    };


        function sinAndCos() {
            var sin = [],
                sin2 = [],
                cos = [],
                rand = [],
                rand2 = []
                ;

            // dates on x axis...
            for (var i = 1437583864000; i < 1437583894000; i = i + 1000) {
                sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
                sin2.push({x: i, y: Math.sin(i/5) * 0.4 - 0.25});
                cos.push({x: i, y: .5 * Math.cos(i/10)});
                rand.push({x:i, y: Math.random() / 10});
                rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
            }

            return [
                {
                    area: true,
                    values: sin,
                    key: "Sine Wave",
                    color: "#ff7f0e",
                    strokeWidth: 4,
                    classed: 'dashed'
                },
                {
                    values: cos,
                    key: "Cosine Wave",
                    color: "#2ca02c"
                },
                {
                    values: rand,
                    key: "Random Points",
                    color: "#2222ff"
                },
                {
                    values: rand2,
                    key: "Random Cosine",
                    color: "#667711",
                    strokeWidth: 3.5
                },
                {
                    area: true,
                    values: sin2,
                    key: "Fill opacity",
                    color: "#EF9CFB",
                    fillOpacity: .1
                }
            ];
        }

  });
