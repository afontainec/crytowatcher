/* eslint-disable */

services

  .service('impressionMetrics', function($http, Utils, RS_SERVER) {

    var server = RS_SERVER;

    this.count = function(params, callback) {
      var query = Utils.toQueryString(params);
      $http.get(server + '/impression/count' + query)
        .success(function(results) {
          callback(null, results.amount, 'impressions');
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.firstDate = function(params, callback) {
      var query = Utils.toQueryString(params);
      $http.get(server + '/impression/firstDate' + query)
        .success(function(results) {
          callback(null, results.date);
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.countAll = function(callback) {
      this.count('', callback);
    }

    this.byDay = function (params, callback) {
      var query = Utils.toQueryString(params);
      $http.get(server + '/impression/count/byday' + query)
        .success(function(results) {
          callback(null, results.data);
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.byHour = function (params, callback) {
      var query = Utils.toQueryString(params);
      $http.get(server + '/impression/count/byhour' + query)
        .success(function(results) {
          callback(null, results.data);
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.totalVisitOf = function(_of, id, callback) {
      $http.get('/api/v1/' + _of + '/' + id + '/metrics/impressions/count')

      .success(function(results) {
        callback(undefined, results);
        })
        .error(function(data) {
          callback(data);
        });
    }

    this.endusers = function(params, callback) {
      var query = Utils.toQueryString(params);
      $http.get(server + '/impression/count/enduser' + query)
      .success(function(results) {
          callback(undefined, results.data);
        })
        .error(function(data) {
          callback(data);
        });
    };


    this.getTotalEndUsers = function(_of, id, callback) {
      $http.get('/api/v1/' + _of + '/' + id + '/metrics/endusers/count')

      .success(function(results) {
          callback(undefined, results);
        })
        .error(function(data) {
          callback(data);
        });
    };

    this.getTotalVisits = function(_of, id, callback) {
      $http.get('/api/v1/'+ _of +'/' + id + '/metrics/impressions/count')

      .success(function(results) {
          var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          var firstDate = new Date(results.date);
          var secondDate = new Date();


          var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
          if( diffDays === 0){
            diffDays = 1;
          }
          results.days = diffDays;
          callback(null, results)
        })
        .error(function(data) {
          callback(data);
        });
    }
});
