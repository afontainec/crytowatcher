/* eslint-disable */

services

  .service('surveyService', function($http, Utils, RS_SERVER) {
    this.count = function(params, callback) {
      var query = Utils.toQueryString(params);
      $http.get(RS_SERVER + '/survey/count' + query)
        .success(function(results) {
          callback(null, results.amount, 'surveys');
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.countAll = function(callback) {
      this.count('', callback);
    }

    this.toggleIsActive = function(id, callback) {
      var url = RS_SERVER + '/survey/' + id + '/toggleIsActive';

      $http.put(url)
        .success(function(data) {
          callback(null, data.survey);
        })
        .error(function(data) {
          callback(data || 'Error')
        });
    };

    this.countResponses = function(survey_id, callback) {
      var params = {
        survey_id
      };
      if (!survey_id) {
        params = null;
      }
      var query = Utils.toQueryString(params);

      var url = RS_SERVER + '/response/count' + query;

      $http.get(url)
        .success(function(data) {
          callback(null, data.amount);
        })
        .error(function(data) {
          callback(data || 'Error')
        });
    }

    this.endusers = function(survey_id, callback) {
      var params = {
        survey_id
      };
      if (!survey_id) {
        params = null;
      }
      var query = Utils.toQueryString(params);

      var url = RS_SERVER + '/response/count/enduser' + query;

      $http.get(url)
        .success(function(result) {
          callback(null, result.data);
        })
        .error(function(data) {
          callback(data || 'Error')
        });
    }

    this.responseByDay = function(survey_id, callback) {
      var params = {
        survey_id
      };
      if (!survey_id) {
        params = null;
      }
      var query = Utils.toQueryString(params);

      var url = RS_SERVER + '/response/count/byday' + query;

      $http.get(url)
        .success(function(result) {
          callback(null, result.data);
        })
        .error(function(data) {
          callback(data || 'Error')
        });

    }
    this.save = function(survey, callback) {
      $http.post(RS_SERVER + '/survey/new', survey)
        .success(function(result) {
          callback(null, result);
        })
        .error(function(data) {
          callback(data || 'Error')
        });
    }

    this.update = function(survey, callback) {
      var url = RS_SERVER + '/survey/' + survey.id +'/update';

      $http.put(url, survey)
        .success(function(result) {
          callback(null, result.survey);
        })
        .error(function(data) {
          callback(data || 'Error')
        });
    }
  });
