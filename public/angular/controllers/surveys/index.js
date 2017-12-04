/* eslint-disable */
controllers

  .controller('surveyIndexController', function($scope, $http, $window, Utils, surveyService) {
    $scope.surveys = {};

    $scope.error = null;
    $scope.success = null;


    // Ordering

    $scope.myOrderBy = 'title';

    // loading

    $scope.loadingResponseCount = true;


    // Get all surveys
    $scope.initializeSurveys = function(surveys, selectedSurvey, responses) {
      if (surveys) {
        $scope.surveys = Utils.parseJson(surveys);
      }
      if (selectedSurvey) {
        $scope.selectedSurvey = Utils.parseJson(selectedSurvey);
      }
      if (responses) {
        $scope.responses = Utils.parseJson(responses);
      }
    };


    // toggle is_active in survey
    $scope.toggleIsActive = function(survey) {
      surveyService.toggleIsActive(survey.id, locallyUpdateSurvey);
    };

    function locallyUpdateSurvey(err, updated_survey) {
      if (err) {
        return;
      };
      for (let i = 0; i < $scope.surveys.length; i++) {
        if ($scope.surveys[i].id == updated_survey.id) {
          $scope.surveys[i] = updated_survey;
        }
      }
    }

    $scope.orderByMe = function(key) {
      if ($scope.myOrderBy === key) {
        $scope.myOrderBy = `-${key}`;
      } else {
        $scope.myOrderBy = key;
      }
    };

    $scope.getTotalResponses = function(survey) {
      surveyService.countResponses(survey.id, function(err, count) {
        if (err) {
          survey.totalResponses = '-';
          return;
        }
        survey.totalResponses = count;

      });
    };
  });
