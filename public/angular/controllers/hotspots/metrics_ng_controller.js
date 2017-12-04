/* eslint-disable */
controllers.controller('hotspotMetricController', function($scope, $http, $window, $location, Utils, visitMetrics) {
  $scope.hotspot = null;
  $scope.metrics = null;
  // metrics

  var options = {
    xaxis: {
      mode: 'time',
      minTickSize: [1, 'hour'],
    },
    series: {
      lines: {
        show: true,
      },
      points: {
        show: false,
      },
    },
    grid: {
      hoverable: true, // IMPORTANT! this is needed for tooltip to work
    },
    tooltip: true,

  };

  $scope.loadingVisitsByDayChart = true;


  $scope.initialize = function(stringHotspot, stringMetrics) {
    $scope.hotspot = Utils.parseJson(stringHotspot);
    $scope.metrics = Utils.parseJson(stringMetrics);

  }

  $scope.getTotalEndUsers = function() {
    visitMetrics.endusers({'hotspot_id': $scope.hotspot.id}, function(err, total) {
      if (err) {
        return;
      }
      $scope.hotspot.totalEndUsers = total;
    });
  }

  $scope.getTotalVisits = function() {
    visitMetrics.count({'hotspot_id': $scope.hotspot.id}, function(err, total) {
      if (err) {
        return;
      }
      $scope.hotspot.totalVisits = total;
      visitMetrics.firstDate({'hotspot_id': $scope.hotspot.id}, function(err, date) {
        if (err) {
          return;
        }
      $scope.hotspot.totalDays = Utils.daysFromNow(date);
      });
    });

  }

  $scope.parseForDailyGraph = function() {
    var data = $scope.metrics.daily;

    var newData = [data[0]];

    for (let i = 1; i < data.length; i++) {
      var d1 = data[i - 1][0];
      var d2 = data[i][0];
      var diff = Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
      var startDate = new Date(data[i - 1][0]);
      if (diff > 1) {
        for (let j = 0; j < diff - 1; j++) {
          var fillDate = new Date(startDate).setDate(startDate.getDate() + (j + 1));
          newData.push([fillDate, 0]);
        }
      }
      newData.push(data[i]);
    }
    var d = newData;
    $scope.loadingVisitsByDayChart = false;

    $.plot('#visits-by-day-line-chart', [d], options);
  }

  $scope.parseForHourlyGraph = function() {
    var d = $scope.metrics.hourly;
    $scope.loadingVisitsByHourChart = false;
    $.plot('#visits-by-hour-line-chart', [d], options);
    }
});
