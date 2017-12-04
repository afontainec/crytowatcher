/*eslint-disable */
controllers

  .controller('upsertSurveyController', function($scope, $http, $window, Utils, surveyService) {

    $scope.MULTIPLE_CHOICE = 'multiple_choice';
    $scope.MULTIPLE_ANSWER = 'multiple_answer';

    $scope.YES_NO = 'yes_no';
    $scope.TRUE_FALSE = 'true_false';
    $scope.LIKERT = 'likert';

    $scope.NUMERIC = 'numeric';
    $scope.SHORT_ANSWER = 'short_text';
    $scope.LONG_ANSWER = 'long_answer';
    // Get all surveys
    $scope.survey = {
      questions: []
    }

    $scope.initialize = function(survey) {
      console.log('llego', survey);
      if (survey) {
        $scope.survey = Utils.parseJson(survey);
      }
    };

    // Create a new survey
    $scope.createSurvey = function() {
      setEnumerationAndNumbers();
      const survey = $scope.survey;
      survey.is_active = true;
      if ($scope.validForm()) {
        surveyService.save(survey, function(err, result) {
          if (err) {
            return;
          }
          $window.location.href = '/surveys';

        });
      }
    };

    // updates a survey
    $scope.updateSurvey = function() {
      if ($scope.validForm()) {
        setEnumerationAndNumbers();
        surveyService.update($scope.survey, function(err, survey) {
          if(err) {
            return;
          }
            $window.location.href = `/surveys/${survey.id}`;
          })
      }
    };

    $scope.validForm = function() {
      let valid = true;
      $scope.error = '';
      if (!$scope.survey.title || $scope.survey.title === '') {
        $scope.error += '- La encuesta debe tener un nombre \n';
        valid = false;
      }
      if ($scope.survey.questions.length === 0) {
        $scope.error += '- La encuesta debe tener al menos una pregunta \n';
        valid = false;
      }
      for (let i = 0; i < $scope.survey.questions.length; i++) {
        if (!$scope.survey.questions[i].title || $scope.survey.questions[i].title === '') {
          $scope.error += `- La pregunta ${i + 1} debe tener un nombre \n`;
          valid = false;
        }
        if ($scope.survey.questions[i].options) {
          for (let j = 0; j < $scope.survey.questions[i].options.length; j++) {
            if (!$scope.survey.questions[i].options[j].statement || $scope.survey.questions[i].options[j].statement === '') {
              $scope.error += `- La alternativa ${j + 1} de la pregunta ${i + 1} debe tener un nombre \n`;
              valid = false;
            }
          }
        }
      }

      return valid;
    };

    // Add question to array. Recieves what type of question is
    $scope.addQuestion = function(myType) {
      // The question to be added
      let question;
      // Create the question depending on what type of question is
      switch (myType) {
        case $scope.MULTIPLE_CHOICE:
          question = createMultipleChoiceQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.MULTIPLE_ANSWER:
          question = createMultipleAnswerQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.YES_NO:
          question = createYesNoQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.TRUE_FALSE:
          question = createTrueFalseQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.LIKERT:
          question = createLikertQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.NUMERIC:
          question = createNumericQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.SHORT_ANSWER:
          question = createShortAnswerQuestion($scope.survey.questions.length + 1);
          break;
        case $scope.LONG_ANSWER:
          question = createLongAnswerQuestion($scope.survey.questions.length + 1);
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
      const i = $scope.survey.questions.indexOf(question);
      // remove from i only 1
      $scope.survey.questions.splice(i, 1);
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
