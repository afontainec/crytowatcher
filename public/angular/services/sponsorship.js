/* eslint-disable */

services

  .service('sponsorService', function($http) {

  const displays = {};
  this.save = function(sponsor, callback) {
    $http.post('/sponsorship/new', sponsor)
      .success(function(results) {

        callback(null, results.sponsorship);
      })
      .error(function(data) {
        callback(data);
      });
  }

  this.update = function(sponsor, callback) {
    $http.put('/sponsorship/' + sponsor.id + '/edit', sponsor)
      .success(function(results) {

        callback(null, results.sponsorship);
      })
      .error(function(data) {
        callback(data);
      });
  }

  this.getTypes = function(callback) {
    $http.get('/sponsorship/types')
      .success(function(results) {
        callback(null, results.data);
      })
      .error(function(data) {
        callback(data);
      });
  }

  this.getNames = function(id, callback) {
    $http.get('/sponsorship/' + id +'/pagenames')
      .success(function(results) {
        callback(null, results.pages);
      })
      .error(function(data) {
        callback(data);
      });
  }

  this.getDisplay = function (sponsor_id, place_id, callback) {
    if(displays[sponsor_id]){
      return callback(null, displays[sponsor_id]);
    }
    $http.get('/sponsorship/' + sponsor_id +'/place/' + place_id + '/display')
      .success(function(results) {
        displays[sponsor_id] = results.data;
        callback(null, results.data);
      })
      .error(function(data) {
        callback(data);
      });
  }
});
