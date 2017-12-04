/*eslint-disable */
controllers

  .controller('metricSurveyController', function($scope, $http, $window, Utils, surveyService) {
    $scope.surveys = {};
    $scope.survey = {
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
    $scope.initialize = function(survey) {
      if (survey) {
        $scope.survey = Utils.parseJson(survey);
      }
    };

    // Order function
    $scope.orderByMe = function(key) {
      if ($scope.myOrderBy === key) {
        $scope.myOrderBy = `-${key}`;
      } else {
        $scope.myOrderBy = key;
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
      // tooltipOpts: {
      //     content: '%y respuestas',
      //     shifts: {
      //         x: -60,
      //         y: 25,
      //     },
      // },

    };


    $scope.getResponsesByDay = function(survey) {
      surveyService.responseByDay(survey.id, function(err, data) {
        $scope.loadingResponseByDayChart = false;

        if (err) {
          $.plot('#response-by-day-line-chart', [], options);
          return;
        }
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

    $scope.getTotalResponses = function() {
      surveyService.countResponses($scope.survey.id, function(err, count) {
        if (err) {
          $scope.survey.totalResponses = '?';
          return;
        }
        $scope.survey.totalResponses = count;

      });
    };

    $scope.getTotalEndUsers = function() {
      surveyService.endusers($scope.survey.id, function(err, count) {
        if (err) {
          $scope.survey.totalEndUsers = '?';
          return;
        }
        $scope.survey.totalEndUsers = count;

      });
    };

    $scope.getNumber = function(num) {
      return new Array(num);
    }

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
      for (let i = 0; i < $scope.survey.questions.length; i++) {
        $scope.survey.questions[i].number = (i + 1);
        if ($scope.survey.questions[i].options) {
          for (let j = 0; j < $scope.survey.questions[i].options.length; j++) {
            $scope.survey.questions[i].options[j].enumeration = String.fromCharCode(64 + parseInt(j + 1, 10));
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
