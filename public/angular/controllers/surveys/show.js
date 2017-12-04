/*eslint-disable */
controllers

  .controller('surveyController', function($scope, $http, $window, Utils) {

  // Get all surveys
  $scope.initialize = function(survey) {
    if (survey) {
      $scope.survey = Utils.parseJson(survey);
    }
  };
});
