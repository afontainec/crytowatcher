/* eslint-disable*/
controllers

  .controller('hotspotIndexController', function($scope, $http, $window, Utils, visitMetrics) {
    $scope.hotspots = {};
    $scope.myOrderBy = 'name';

    $scope.initializeHotspots = function(hotspots) {
      if (hotspots) {
        $scope.hotspots = Utils.parseJson(hotspots);
      }
    };

    $scope.toggleIsActive = function(hotspot) {
      $http.put(`/hotspots/${hotspot.id}/toggleIsActive`)
        .success(function(data) {
          hotspot.is_active = data.hotspot.is_active;
        })
        .error(function(data) {});
    };


    $scope.getTotalEndUsers = function(hotspot) {
      visitMetrics.endusers({
        'hotspot_id': hotspot.id
      }, function(err, data) {
        if (err) {
          return;
        }
        hotspot.totalEndUsers = data;
      });
    }

    $scope.getTotalVisits = function(hotspot) {
      visitMetrics.count({
        'hotspot_id': hotspot.id
      }, function(err, data) {
        if (err) {
          return;
        }
        hotspot.totalVisits = data;

      });
    }

    $scope.setOrderBy = function(key) {
      if ($scope.myOrderBy === key) {
        $scope.myOrderBy = `-${key}`;
      } else {
        $scope.myOrderBy = key;
      }
    };

  });
