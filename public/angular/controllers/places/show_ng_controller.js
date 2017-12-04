/* eslint-disable */
controllers

  .controller('placeController', function($scope, $http, $window, Utils, visitMetrics) {
  $scope.places = {};
  $scope.selectedPlace = null;
  $scope.metrics = {};
  $scope.loadingVisitsByDayChart = true;
  $scope.loadingVisitsByHourChart = true;
  $scope.loadingVisitsByDayAndHourChart = true;



  // Get all places
  $scope.initializePlaces = function(places, selectedPlace) {
    if (places) {
      $scope.places = Utils.parseJson(places);
    }
    if (selectedPlace) {
      $scope.selectedPlace = Utils.parseJson(selectedPlace);
    }
  };

  $scope.initializeMetrics = function(metrics) {

    if (metrics) {
      $scope.metrics = Utils.parseJson(metrics);
    }
  };



  $scope.getKeys = function(json) {
    return Object.keys(json);
  };


  $scope.toggleIsActive = function(place) {
    $http.put(`/places/${place.id}/toggleIsActive`)
      .success(function(data) {
        locallyUpdatePlace(data.place);
      })
      .error(function(data) {
        console.log(data);
      });
  };


  function locallyUpdatePlace(updated_place) {
    for (let i = 0; i < $scope.places.length; i++) {
      if ($scope.places[i].id == updated_place.id) {
        $scope.places[i] = updated_place;
      }
    }
  }

  // Create a new place
  $scope.createPlace = function(place) {
    if ($scope.validForm()) {
      $http.post('/places/new', $scope.selectedPlace)
        .success(function(data) {
          $scope.formData = {};
          $scope.places = data;
          $window.location.href = '/places/' + data.place.id;
        })
        .error(function(error) {
          console.log(error);
        });
    }
  };

  // updates a place
  $scope.updatePlace = function(place) {
    if ($scope.validForm()) {
      $http.put('/places/' + $scope.selectedPlace.id + '/edit', $scope.selectedPlace)
        .success(function(data) {
          place = data.place;
          $window.location.href = '/places/' + place.id;
        })
        .error(function(error) {
          console.log(error);
        });
    }
  };

  $scope.validForm = function() {
    return !($scope.form.$error.required || $scope.form.$error.maxlength ||
      $scope.form.$error.minlength || $scope.form.$error.email || $scope.form.$error.integer);
  };


  $scope.setSelectedPlace = function(place) {
    $scope.selectedPlace = place;
  };


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
    // tooltipOpts: {
    //     content: '%y respuestas',
    //     shifts: {
    //         x: -60,
    //         y: 25,
    //     },
    // },

  };

  function parseDataForDailyGraph(data) {
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

    return newData;
  }

  $scope.getVisitsByDay = function(place) {

    visitMetrics.byDay({place_id: place.id}, function (err, data) {
      if(err){
        $scope.loadingVisitsByDayChart = false;
        $.plot('#visits-by-day-line-chart', [], options);
        return;
      }
      $scope.loadingVisitsByDayChart = false;
      d = parseDataForDailyGraph(data);

      $.plot('#visits-by-day-line-chart', [d], options);
    });
  };

  $scope.getVisitsByHour = function(place) {
    visitMetrics.byHour({place_id: place.id}, function (err, data) {
      if(err){
        $scope.loadingVisitsByHourChart = false;
        $.plot('#visits-by-hour-line-chart', [], options);

        return;
      }
      $scope.loadingVisitsByHourChart = false;
      $.plot('#visits-by-hour-line-chart', [data], options);
    });
  };


  $scope.getTotalVisits = function(place) {
    visitMetrics.count({place_id: place.id}, function (err, data) {
      if (err) {
        place.totalVisits = '?';
        return;
      }
      place.totalVisits = data;
      visitMetrics.firstDate({place_id: place.id}, function (err, date) {
        if(err){
          return;
        }
        place.totalDays = Utils.daysFromNow(date);
      });
    });
  };

  $scope.getTotalEndUsers = function(place) {
    visitMetrics.endusers({place_id: place.id}, function (err, data) {
      if (err) {
        place.totalEndUsers = '?';
        return;
      }
      place.totalEndUsers = data;
    });
  };

  $scope.printTimeZome = function(minutes_offset) {
    if (!minutes_offset && minutes_offset !== 0) {
      return ""
    }
    if (minutes_offset >= 0) {
      return "UTC+" + minutes_offset / 60;
    } else {
      return "UTC" + minutes_offset / 60;
    }
  }

});
