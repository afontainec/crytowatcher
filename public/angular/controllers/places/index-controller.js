/* eslint-disable*/
controllers

  .controller('placeIndexController', function($scope, Utils) {
    $scope.places = {};

    // Get all places
    $scope.initialize = function(places) {
      if (places) {
        $scope.places = Utils.parseJson(places);
        $scope.places.sort((a,b) => {
          return b.id - a.id;
        });
      }
    };

  });
