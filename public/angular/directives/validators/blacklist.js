/*eslint-disable*/
app.directive('blacklist', function () {
  return {
    require: 'ngModel',
    link(scope, elem, attr, ngModel) {
      const blacklist = attr.blacklist.split(',');

          // For DOM -> model validation
      ngModel.$parsers.unshift(function (value) {
        console.log('entro');
        const valid = blacklist.indexOf(value) === -1;
        ngModel.$setValidity('blacklist', valid);
        console.log(valid);
        return valid ? value : undefined;
      });

          // For model -> DOM validation
      ngModel.$formatters.unshift(function (value) {
        console.log('entro');
        ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
        return value;
      });
    },
  };
});
