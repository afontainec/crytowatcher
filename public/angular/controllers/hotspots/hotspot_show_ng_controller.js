/* eslint-disable */
controllers.controller('hotspotShowController', function($scope, $http, $window, $location, Utils, placeService) {
  $scope.hotspot = null;

  $scope.initialize = function(stringHotspot) {
    $scope.hotspot = Utils.parseJson(stringHotspot);
    $scope.hotspot.iframeURL = '/hotspots/' + $scope.hotspot.id + '?from=web';
    placeService.get($scope.hotspot.place_id, function(err, place) {
      if (err) {
        return;
      }
      $scope.hotspot.place = place.name;
    });
  }
});
