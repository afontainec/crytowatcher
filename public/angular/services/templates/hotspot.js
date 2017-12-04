/* eslint-disable */

services

  .service('hotspotTemplateService', function($http, Utils) {
  this.all = function(jsonFormat, callback) {
    var query = Utils.toQueryString({json: jsonFormat});
    $http.get('/hotspotTemplates' + query)
      .success(function(results) {
        callback(null, results.data);
      })
      .error(function(data) {
        callback(data);
      });
  }

  // this.get = function(id, callback) {
  //   $http.get('/api/v1/places/' + id)
  //     .success(function(result) {
  //       callback(null, result.place);
  //     }).error(function(data) {
  //       callback(data);
  //     });
  // }
});
