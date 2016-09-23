(function () {

  'use strict';

  /**
   * @ngdoc function
   * @name atacamaApp.controller:DatePickerController
   * @description
   * # WidgetController
   * Controller of the atacamaApp
   */
  angular.module('atacamaApp')
    .controller('DatePickerController', DatePickerController);

  function DatePickerController(
    $scope, $log, turbineService) {
    var vm = this;

    $log.info("datePicker init");

    vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    vm.format = vm.formats[0];
    vm.altInputFormats = ['M!/d!/yyyy'];

    vm.dateOptions = {
      // dateDisabled: isDisabled,
      formatYear: 'yy',
      // maxDate: new Date(2020, 5, 22),
      // minDate: new Date(),
      startingDay: 1
    };

    vm.popup1 = {
      opened: false
    };

    // Disable weekend selection
    vm.isDisabled = function (date, mode) {
      return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
    };

    vm.today = function () {
      var selectedDate = new Date();
      // selectedDate.setHours(0);
      // selectedDate.setMinutes(0);
      // selectedDate.setSeconds(0);
      vm.selectedDate = selectedDate;
    };

    vm.clear = function () {
      vm.selectedDate = null;
    };

    vm.open1 = function () {
      vm.popup1.opened = true;
    };

    // ensure the date is always set to the start of the day...
    $scope.$watch('vm.selectedDate', function (newValue, oldValue) {
      if (!vm.selectedDate) {
        return;
      }
      vm.selectedDate.setHours(0);
      vm.selectedDate.setMinutes(0);
      vm.selectedDate.setSeconds(0);
    }, false);

    // if we have been given a date in string format, then parse it...
    if (!_.isDate(vm.selectedDate)) {
      vm.selectedDate = new Date(vm.selectedDate);
    }

    // if we have missing or invalid date object, then init to today...
    // angular.isUndefined(vm.selectedDate) || vm.selectedDate.toString() === 'Invalid Date'
    if (A.isInvalid(vm.selectedDate)) {
      vm.selectedDate = new Date();
    }

  }


})();
