/*eslint-disable*/
var app = angular.module('crypto-web-app', ['app.controllers', 'app.directives', 'app.services', 'app.filters']);


var INTEGER_REGEXP = /^\-?\d+$/;
app.directive('integer', function validate() {
  return {
    require: 'ngModel',
    link(scope, elm, attrs, ctrl) {
      ctrl.$validators.integer = function validate(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          // consider empty models to be valid
          return true;
        }

        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          return true;
        }

        // it is invalid
        return false;
      };
    },
  };
});

// app.constant('RS_SERVER', 'https://rsbe.herokuapp.com');
// app.constant('MV_SERVER', 'https://accionetdev.herokuapp.com');
app.constant('RS_SERVER', 'http://localhost:8080');
app.constant('MV_SERVER', 'http://localhost:3000');
