/* eslint-disable */

services

  .service('userService', function($http) {
  this.checkAuth = function(id, pass, callback) {
    $http.post('/api/v1/users/' + id + '/authCheck', {
        id,
        pass,
      })
      .success(function(results) {
        callback(null, results.isValid);
      })
      .error(function(data) {
        callback(data);
      });
  }

  this.update = function(params, callback) {
    console.log(params.id);
    $http.put('/users/' + params.id + '/edit', params)
      .success(function(data) {
        user = data.user;
        callback(null, user);
      })
      .error(function(error) {
        callback(error);
      });
  }

  this.updatePassword = function(params, callback) {
    console.log(params);
    $http.put('/api/v1/users/' + params.id + '/update/auth', params)
      .success(function(data) {
        user = data.success;
        callback(null, user);
      })
      .error(function(error) {
        callback(error);
      });
  }

});
