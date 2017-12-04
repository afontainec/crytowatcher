/* eslint-disable */
controllers

  .controller('surveyIndexController', function($scope, $http, $window, Utils) {
  $scope.surveys = {};
  $scope.selectedSurvey = null;
  $scope.responses = {};

  $scope.data = [];
  // For creating an survey
  $scope.questions = [];
  $scope.title = '';

  $scope.error = null;
  $scope.success = null;

  $scope.MULTIPLE_CHOICE = 'multiple_choice';
  $scope.YES_NO = 'yes_no';
  $scope.NUMERIC = 'numeric';
  $scope.SHORT_ANSWER = 'short_text';
  $scope.LONG_ANSWER = 'long_answer';

  // ORdering

  $scope.myOrderBy = 'title';

  // loading

  $scope.loadingResponseByDayChart = true;
  $scope.loadingResponseByHourChart = true;

  $scope.loadingEndUserLineChart = true;
  $scope.loadingResponseCount = true;
  $scope.loadingEndUserCount = true;


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


  // toggle active in survey
  $scope.toggleIsActive = function(survey) {
    $http.put('/surveys/' + survey.id + '/toggleIsActive')
      .success(function(data) {
        locallyUpdateSurvey(data.survey);
      })
      .error(function(data) {});
  };

  function locallyUpdateSurvey(updated_survey) {
    if ($scope.selectedSurvey && $scope.selectedSurvey.id == updated_survey.id)
      $scope.selectedSurvey = updated_survey;
    for (let i = 0; i < $scope.surveys.length; i++) {
      if ($scope.surveys[i].id == updated_survey.id) {
        $scope.surveys[i] = updated_survey;
      }
    }
  }

  // Create a new survey
  $scope.createSurvey = function() {
    addEnumerations();
    const survey = {
      user_id: 1,
      title: $scope.title,
      is_active: true,
      questions: $scope.questions,
    };
    if ($scope.validForm()) {
      $http.post('/surveys/new', survey)
        .success(function(data) {
          $window.location.href = '/surveys/all';
        })
        .error(function(error) {
          console.log('Error: ' + error);
        });
    }
  };

  // updates a survey
  $scope.updateSurvey = function(survey) {
    if ($scope.validForm()) {
      $http.put('/surveys/' + $scope.selectedSurvey.id + '/edit', $scope.selectedSurvey)
        .success(function(data) {
          survey = data.survey;
        })
        .error(function(error) {});
    }
  };

  $scope.validForm = function() {
    let valid = true;
    $scope.error = '';
    if ($scope.title === '') {
      $scope.error += '- La encuesta debe tener un nombre \n';
      valid = false;
    }
    if ($scope.questions.length == 0) {
      $scope.error += '- La encuesta debe tener al menos una pregunta \n';
      valid = false;
    }
    for (let i = 0; i < $scope.questions.length; i++) {
      if (!$scope.questions[i].title || $scope.questions[i].title == '') {
        $scope.error += `- La pregunta ${i + 1} debe tener un nombre \n`;
        valid = false;
      }
      if ($scope.questions[i].options) {
        for (let j = 0; j < $scope.questions[i].options.length; j++) {
          if (!$scope.questions[i].options[j].statement || $scope.questions[i].options[j].statement == '') {
            $scope.error += `- La alternativa ${j + 1} de la pregunta ${i + 1} debe tener un nombre \n`;
            valid = false;
          }
        }
      }
    }

    return valid;
  };


  $scope.setSelectedSurvey = function(survey) {
    $scope.selectedSurvey = survey;
  };


  // FOR CREATING NEW survey

  // Add question to array. Recieves what type of question is
  $scope.addQuestion = function(myType) {
    // The question to be added
    let question;
    // Create the question depending on what type of question is
    switch (myType) {
      case $scope.MULTIPLE_CHOICE:
        question = createMultipleChoiceQuestion($scope.questions.length + 1);
        break;
      case $scope.YES_NO:
        question = createYesNoQuestion($scope.questions.length + 1);
        break;
      case $scope.NUMERIC:
        question = createNumericQuestion(q$scope.uestions.length + 1);
        break;
      case $scope.SHORT_ANSWER:
        question = createShortAnswerQuestion($scope.questions.length + 1);
        break;
      case $scope.LONG_ANSWER:
        question = createLongAnswerQuestion($scope.questions.length + 1);
        break;
    }
    // If the question is not null add it to questions
    if (question) {
      $scope.questions.push(question);
    }
  };

  $scope.deleteQuestion = function(question) {
    const i = $scope.questions.indexOf(question);
    // remove from i only 1
    $scope.questions.splice(i, 1);
  };

  // add a new option to 'option'
  $scope.addOption = function(question) {
    // push the new option
    question.options.push({
      value: '',
    });
    // questions[0].options[0] = "ME";
  };

  // Remove the option 'option' from question
  $scope.deleteOption = function(question, option) {
    // get the index to where to remove
    const i = question.options.indexOf(option);
    // remove from i only 1
    question.options.splice(i, 1);
  };


  // Order function

  $scope.orderByMe = function(key) {
    if ($scope.myOrderBy === key) {
      $scope.myOrderBy = `-${key}`;
    } else {
      $scope.myOrderBy = key;
    }
  };

  $scope.index = 0;
  $scope.getData = function(question) {
    if (question.type == 'multiple_choice') {
      $scope.index += 1;
      const data = [];
      const metrics = question.metrics;
      for (let i = 0; i < Object.keys(metrics).length; i++) {
        const entry = {
          label: `${Object.keys(metrics)[i]}) ${metrics[Object.keys(metrics)[i]].statement}`,
          data: metrics[Object.keys(metrics)[i]].count,
        };
        data.push(entry);
      }
      return data;
    }
  };

  // metrics

  const options = {
    xaxis: {
      mode: 'time',
      minTickSize: [1, 'hour'],
    },
    series: {
      lines: {
        show: true,
      },
      points: {
        show: false,
      },
    },
    grid: {
      hoverable: true, // IMPORTANT! this is needed for tooltip to work
    },
    tooltip: true,
    tooltipOpts: {
      content: '%y respuestas',
      shifts: {
        x: -60,
        y: 25,
      },
    },

  };
  $scope.getResponsesByDay = function(survey) {
    $http.get('/api/v1/surveys/' + survey.id + '/metrics/responses/byday')
      .success(function(results) {
        const data = results.data;
        $scope.loadingResponseByDayChart = false;

        const startDay = data[0][0];
        const newData = [data[0]];

        for (let i = 1; i < data.length; i++) {
          const d1 = data[i - 1][0];
          const d2 = data[i][0];
          const diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
          const startDate = new Date(data[i - 1][0]);
          if (diff > 1) {
            for (let j = 0; j < diff - 1; j++) {
              const fillDate = new Date(startDate).setDate(startDate.getDate() + (j + 1));
              newData.push([fillDate, 0]);
            }
          }
          newData.push(data[i]);
        }

        const d = newData;


        $.plot('#response-by-day-line-chart', [d], options);
      })
      .error(function(data) {});
  };

  $scope.getResponsesByHour = function(survey) {
    $http.get('/api/v1/surveys/' + survey.id + '/metrics/responses/byhour')
      .success(function(results) {
        const d = results.data;
        // get Offset
        const offset = new Date().getTimezoneOffset();
        for (let i = 0; i < d.length; i++) {
          d[i][0] -= (offset * 60 * 1000);
        }
        $scope.loadingResponseByHourChart = false;
        $.plot('#response-by-hour-line-chart', [d], options);
      })
      .error(function(data) {});
  };

  $scope.getTotalResponses = function(survey) {
    $http.get('/api/v1/surveys/' + survey.id + '/metrics/responses/count')

    .success(function(results) {
        survey.totalResponses = results.data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  $scope.getTotalEndUsers = function(survey) {
    $http.get('/api/v1/surveys/' + survey.id + '/metrics/enduser/count')

    .success(function(results) {
        survey.totalEndUsers = results.data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // ########################################
  // NOT SCOPE FUNCTIONS ###################
  // ########################################


  function addEnumerations() {
    for (let i = 0; i < $scope.questions.length; i++) {
      if ($scope.questions[i].options) {
        for (let j = 0; j < $scope.questions[i].options.length; j++) {
          $scope.questions[i].options[j].enumeration = String.fromCharCode(64 + parseInt(j + 1, 10));
        }
      }
    }
  }
})

// Filter for displaying the alternatives, it basically transform numbers to letter in this way: 0 = A, 1 = B and so on
// Code taken from http://stackoverflow.com/questions/22786483/angularjs-show-index-as-char answer from: Engineer
.filter('character', function() {
  return function(input) {
    return String.fromCharCode(64 + parseInt(input, 10));
  };
});
