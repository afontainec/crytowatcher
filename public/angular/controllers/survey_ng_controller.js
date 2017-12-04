/*eslint-disable */
controllers

  .controller('surveyController', function($scope, $http, $window, Utils) {
  $scope.surveys = {};
  $scope.selectedSurvey = {
    questions: [],
  };
  $scope.responses = {};

  $scope.data = [];
  // For creating an survey
  $scope.questions = [];
  $scope.title = '';

  $scope.error = null;
  $scope.success = null;

  $scope.MULTIPLE_CHOICE = 'multiple_choice';
  $scope.MULTIPLE_ANSWER = 'multiple_answer';

  $scope.YES_NO = 'yes_no';
  $scope.TRUE_FALSE = 'true_false';
  $scope.LIKERT = 'likert';

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
  $scope.initializeSurveys = function(surveys, selectedSurvey) {
    if (selectedSurvey) {
      $scope.selectedSurvey = Utils.parseJson(selectedSurvey);
    }
  };


  // toggle active in survey
  $scope.toggleIsActive = function(survey) {
    $http.put(`/surveys/${survey.id}/toggleIsActive`)
      .success(function(data) {
        locallyUpdateSurvey(data.survey);
      })
      .error(function() {});
  };

  // toggle active in survey
  $scope.delete = function(survey) {
    $http.delete(`/surveys/${survey.id}/delete`)
      .success(function() {
        // data.survey
      })
      .error(function() {});
  };

  function locallyUpdateSurvey(updated_survey) {
    if ($scope.selectedSurvey && $scope.selectedSurvey.id === updated_survey.id) {
      $scope.selectedSurvey = updated_survey;
    }
    for (let i = 0; i < $scope.surveys.length; i++) {
      if ($scope.surveys[i].id === updated_survey.id) {
        $scope.surveys[i] = updated_survey;
      }
    }
  }

  // Create a new survey
  $scope.createSurvey = function() {
    setEnumerationAndNumbers();
    const survey = $scope.selectedSurvey;
    survey.is_active = true;
    console.log(survey);
    if ($scope.validForm()) {
      $http.post('/surveys/new', survey)
        .success(function() {
          $window.location.href = '/surveys';
        })
        .error(function() {});
    }
  };

  // updates a survey
  $scope.updateSurvey = function() {
    if ($scope.validForm()) {
      setEnumerationAndNumbers();
      $http.put(`/surveys/${$scope.selectedSurvey.id}/update`, $scope.selectedSurvey)
        .success(function(data) {
          $window.location.href = `/surveys/${data.survey.id}`;
        })
        .error(function(err) {
          console.log(err);
        });
    }
  };

  $scope.validForm = function() {
    let valid = true;
    $scope.error = '';
    if (!$scope.selectedSurvey.title || $scope.selectedSurvey.title === '') {
      $scope.error += '- La encuesta debe tener un nombre \n';
      valid = false;
    }
    if ($scope.selectedSurvey.questions.length === 0) {
      $scope.error += '- La encuesta debe tener al menos una pregunta \n';
      valid = false;
    }
    for (let i = 0; i < $scope.selectedSurvey.questions.length; i++) {
      if (!$scope.selectedSurvey.questions[i].title || $scope.selectedSurvey.questions[i].title === '') {
        $scope.error += `- La pregunta ${i + 1} debe tener un nombre \n`;
        valid = false;
      }
      if ($scope.selectedSurvey.questions[i].options) {
        for (let j = 0; j < $scope.selectedSurvey.questions[i].options.length; j++) {
          if (!$scope.selectedSurvey.questions[i].options[j].statement || $scope.selectedSurvey.questions[i].options[j].statement === '') {
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
        question = createMultipleChoiceQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.MULTIPLE_ANSWER:
        question = createMultipleAnswerQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.YES_NO:
        question = createYesNoQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.TRUE_FALSE:
        question = createTrueFalseQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.LIKERT:
        question = createLikertQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.NUMERIC:
        question = createNumericQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.SHORT_ANSWER:
        question = createShortAnswerQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      case $scope.LONG_ANSWER:
        question = createLongAnswerQuestion($scope.selectedSurvey.questions.length + 1);
        break;
      default:
        break;
    }
    // If the question is not null add it to questions
    if (question) {
      $scope.survey.questions.push(question);
    }
  };

  $scope.deleteQuestion = function(question) {
    const i = $scope.selectedSurvey.questions.indexOf(question);
    // remove from i only 1
    $scope.selectedSurvey.questions.splice(i, 1);
  };

  // add a new option to 'option'
  $scope.addOption = function(question) {
    // push the new option
    question.options.push({});
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
    if (question.type === 'multiple_choice') {
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
    if (question.type === 'multiple_answer') {
      return multipleAnswerData(question);
    }
  };

  function multipleAnswerData(question) {
    $scope.index += 1;
    const data = {
      info: [],
      ticks: []
    };
    const options = question.options;
    const metrics = question.metrics;

    for (var i = 0; i < options.length; i++) {
      const metric = metrics[options[i].enumeration]
      if(metric) {
        data.info.push([i, metric.count]);
      } else {
        data.info.push([i, 0]);
      }
      data.ticks.push([i, options[i].statement]);
    }
    return data;
  }
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
    // tooltipOpts: {
    //     content: '%y respuestas',
    //     shifts: {
    //         x: -60,
    //         y: 25,
    //     },
    // },

  };


  $scope.getResponsesByDay = function(survey) {
    $http.get(`/api/v1/surveys/${survey.id}/metrics/responses/byday`)
      .success(function(results) {
        const data = results.data;
        $scope.loadingResponseByDayChart = false;

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
      .error(function() {
        $scope.loadingResponseByDayChart = false;
        $.plot('#response-by-day-line-chart', [], options);


      });
  };

  $scope.getResponsesByHour = function(survey) {
    $http.get(`/api/v1/surveys/${survey.id}/metrics/responses/byhour`)
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
      .error(function() {
        $scope.loadingResponseByHourChart = false;
        $.plot('#response-by-hour-line-chart', [], options);


      });
  };

  $scope.getTotalResponses = function(survey) {
    $http.get(`/api/v1/surveys/${survey.id}/metrics/responses/count`)
      .success(function(results) {
        survey.totalResponses = results.data.toString();
      })
      .error(function() {
        survey.totalResponses = "?";
      });
  };

  $scope.getTotalEndUsers = function(survey) {
    $http.get(`/api/v1/surveys/${survey.id}/metrics/enduser/count`)
      .success(function(results) {
        survey.totalEndUsers = results.data.toString();
      })
      .error(function() {
        survey.totalEndUsers = "?";

      });
  };

  $scope.getNumber = function(num) {
    return new Array(num);
  }

  // ########################################
  // NOT SCOPE FUNCTIONS ###################
  // ########################################


  function createMultipleChoiceQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.MULTIPLE_CHOICE,
      options: [{
        statement: '',
      }, {
        statement: '',
      }, {
        statement: '',
      }, {
        statement: '',
      }],
    };
    return question;
  }

  function createMultipleAnswerQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.MULTIPLE_ANSWER,
      options: [{
        statement: '',
      }, {
        statement: '',
      }, {
        statement: '',
      }, {
        statement: '',
      }],
    };
    return question;
  }

  function createYesNoQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.MULTIPLE_CHOICE,
      options: [{
        enumeration: 'a',
        statement: 'Si',
      }, {
        enumeration: 'b',
        statement: 'No',
      }],
    };
    return question;
  }

  function createTrueFalseQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.MULTIPLE_CHOICE,
      options: [{
        enumeration: 'a',
        statement: 'Verdadero',
      }, {
        enumeration: 'b',
        statement: 'Falso',
      }],
    };
    return question;
  }

  function createLikertQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.MULTIPLE_CHOICE,
      options: [{
        enumeration: 'a',
        statement: 'Muy de acuerdo',
      }, {
        enumeration: 'b',
        statement: 'De acuerdo',
      }, {
        enumeration: 'c',
        statement: 'Neutro',
      }, {
        enumeration: 'd',
        statement: 'En desacuerdo',
      }, {
        enumeration: 'e',
        statement: 'Muy en desacuerdo',
      }],
    };
    return question;
  }

  function createShortAnswerQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.SHORT_ANSWER,
      options: [],
    };
    return question;
  }

  function createLongAnswerQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.LONG_ANSWER,
      options: [],
    };
    return question;
  }

  function createNumericQuestion(number) {
    const question = {
      title: '',
      number,
      type: $scope.NUMERIC,
      options: [],
    };
    return question;
  }

  function setEnumerationAndNumbers() {
    for (let i = 0; i < $scope.selectedSurvey.questions.length; i++) {
      $scope.selectedSurvey.questions[i].number = (i + 1);
      if ($scope.selectedSurvey.questions[i].options) {
        for (let j = 0; j < $scope.selectedSurvey.questions[i].options.length; j++) {
          $scope.selectedSurvey.questions[i].options[j].enumeration = String.fromCharCode(64 + parseInt(j + 1, 10));
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
