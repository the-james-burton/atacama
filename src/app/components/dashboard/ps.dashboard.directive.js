(function() {

  'use strict';

  angular.module('psDashboard').directive('psDashboard', function() {
    return {
      templateUrl: 'app/components/dashboard/ps.dashboard.html',
      link: linkFunc
    };

    function linkFunc(scope, element, attrs) {
      scope.addNewWidget = function(widget) {
        //deep copy widget settings to be used in new widget
        var newWidget = angular.copy(widget.settings);
        //add new widget to array
        scope.widgets.push(newWidget);
      };
    }

  });

})();
