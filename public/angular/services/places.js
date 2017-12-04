/* eslint-disable */

services

  .service('placeService', function($http, Utils) {
  this.getNames = function(callback) {
    $http.get('/api/v1/places/all/names')
      .success(function(results) {
        callback(null, results.data);
      })
      .error(function(data) {
        callback(data);
      });
  }

  this.save = function(place, callback) {
    $http.post('/places/new', place)
      .success(function(results) {
        console.log(results);
        callback(null, results.place);
      })
      .error(function(data) {
        callback(data);
      });
  }



  this.get = function(id, callback) {
    $http.get('/api/v1/places/' + id)
      .success(function(result) {
        callback(null, result.place);
      }).error(function(data) {
        callback(data);
      });
  }
});
