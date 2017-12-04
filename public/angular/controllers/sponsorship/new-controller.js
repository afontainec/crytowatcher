/* eslint-disable */
controllers

  .controller('newSponsorController', function($scope, $window, Utils, placeService, $rootScope, sponsorService) {

    var index = 1;

    $scope.hasLandingPage = false;

    var adsID = {
      'Splashscreen Ad + Samsung': 3,
      'Upperbanner Ad': 2,
      'Gold Ad': 1
    }
    let display = undefined;

    $scope.loadingPlaces = true;
    $scope.loadPlacesFailed = false;
    $scope.sponsor = {
      type: 0,
      values: {},
    };
    $scope.saveProgress = 0;
    $scope.uploading = false;
    $scope.uploaded = false;

    $scope.MODE = $scope.SAVE_MODE;

    $scope.SAVE_MODE = 1;
    $scope.EDIT_MODE = 2;


    $scope.sponsorships = [];


    $scope.init = function(mode, sponsor) {
      $scope.MODE = mode;
      if ($scope.MODE == $scope.SAVE_MODE) {
        $scope.sponsor = {
          type: 0,
          values: {},
        };
      } else {
        $scope.sponsor = sponsor;
        setDates();
      }
    }

    function isPrevious(date1, date2) {
      var dnum1 = date1.getFullYear() * 500 + date1.getMonth() * 40 + date1.getDate();
      var dnum2 = date2.getFullYear() * 500 + date2.getMonth() * 40 + date2.getDate();
      return dnum1 < dnum2;
    }

    function getStartOptions(today, start) {
      var startIsBeforeToday = isPrevious(start, today);
      if (startIsBeforeToday) {
        return {
          format: 'DD/MM/YYYY',
          minDate: start.toString(),
          maxDate: start.toString(),
          date: start.toString()
        };
      }
      var oneDay = 24 * 60 * 60 * 1000;
      var tomorrow = new Date(today + oneDay);
      return {
        format: 'DD/MM/YYYY',
        minDate: tomorrow.toString(),
        date: start.toString()
      };
    }

    function getEndOptions(start, today, end) {
      var endIsBeforeToday = isPrevious(end, today);
      if (endIsBeforeToday) {
        return {
          format: 'DD/MM/YYYY',
          minDate: end.toString(),
          maxDate: end.toString(),
          date: end.toString()
        };
      }
      var oneDay = 24 * 60 * 60 * 1000;
      var startIsBeforeToday = isPrevious(start, today);
      var min;
      if (startIsBeforeToday) {
        min = new Date(today + oneDay);
      } else {
        min = new Date(start + oneDay);

      }
      return {
        format: 'DD/MM/YYYY',
        minDate: min.toString(),
        date: end.toString()
      };


    }

    $scope.changeableDate = function() {
      if ($scope.MODE == $scope.SAVE_MODE) {
        return true;
      }
      return isPrevious(new Date(), new Date($scope.sponsor.start_date));
    }

    function setDates() {
      setTimeout(function() {
        $(function() {
          var today = new Date();
          var start = new Date($scope.sponsor.start_date);
          var end = new Date($scope.sponsor.end_date);
          var optionStart = getStartOptions(today, start);
          var optionEnd = getEndOptions(start, today, end);

          $('#start_date').datetimepicker(optionStart);
          $('#end_date').datetimepicker(optionEnd);
          $("#start_date").on("dp.change", function(e) {
            $('#end_date').data("DateTimePicker").minDate(e.date);
          });
          $("#end_date").on("dp.change", function(e) {
            $('#start_date').data("DateTimePicker").maxDate(e.date);
          });
        });
      }, 500);

    }

    $scope.getPlaces = function() {

      placeService.getNames(function(err, places) {
        $scope.loadingPlaces = false;
        if (err) {
          $scope.loadPlacesFailed = true;
          return;
        }
        $scope.places = places;
        if ($scope.MODE == $scope.SAVE_MODE) {
          $scope.sponsor.place_id = places[3].id;
        }
      })
    }

    function stringToDate(string) {
      var parts = string.split('/');
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    function getDates() {
      var startDate = $('#start_date').find("input").val();
      var endDate = $('#end_date').find("input").val();

      $scope.sponsor.start_date = stringToDate(startDate);
      $scope.sponsor.end_date = stringToDate(endDate);
    }

    progressBarEvent = 'progressBarEvent';

    $scope.prepareToUpsert = function() {
      $(".previous").css("display", "none");
      getDates();
      // When update this could have things in it, but in order for $on('values') to work properly it should be empty
      $scope.sponsor.values = {};
      $rootScope.$broadcast('readyToRecieveValues');
    }

    $scope.$on('values', function(event, data) {
      Object.assign($scope.sponsor.values, data);
      if (Object.keys($scope.sponsor.values).length === display.length) {
        if ($scope.MODE == $scope.SAVE_MODE) {
          save();
        } else {
          update();
        }
      }

    });

    // Creo que esto nunca sucede FIXME
    $scope.$on('splashScreenValues', function(event, data) {
      $scope.sponsor.values["TWO-PHASE-LANDING-PAGE"] = data;
      // save();
    });

    function save() {
      $scope.uploading = true;
      sponsorService.save($scope.sponsor, function(err, data) {
        if (err) { // TODO
          console.log(err);
          return;
        }
        data.progressBarEvent = progressBarEvent;
        incrementProgress(20);
        $rootScope.$broadcast('uploadFile', data);
      });
    }

    function update() {
      $scope.uploading = true;
      delete $scope.sponsor.adValues;
      console.log($scope.sponsor);
      sponsorService.update($scope.sponsor, function(err, data) {
        if (err) { // TODO
          console.log(err);
          return;
        }
        data.progressBarEvent = progressBarEvent;
        incrementProgress(20);
        $rootScope.$broadcast('uploadFile', data);
      });
    }

    function incrementProgress(c) {

      $scope.saveProgress += c;
      if ($scope.saveProgress) {
        $scope.uploading = true;
      }
      if ($scope.saveProgress >= 100) {
        $window.location.href = '/sponsorship';
        $scope.saveProgress = 100;
        $scope.uploading = false;
        $scope.uploaded = true;
      }
    }

    $scope.$on(progressBarEvent, function(event, data) {
      var increment = $scope.hasLandingPage ? 40 : 80;
      incrementProgress(increment * data / 100);
    })



    function getSponsorships() {
      sponsorService.getTypes(function(err, sponsorships) {
        if (err) {
          return;
        }
        $scope.sponsorships = sponsorships;
        if ($scope.MODE == $scope.SAVE_MODE) {
          $scope.sponsor.type = sponsorships[0].id;
        } else {
          setTimeout(function() {
            $(function() {
              $('#type-select').val($scope.sponsor.type);
            });
          }, 500);
        }
      })
    }


    $scope.hasPortal = function() {
      return true;
    }

    function broadcastDisplay() {
      for (var i = 0; i < display.length; i++) {
        var name = display[i].name;
        if (name == 'Splashscreen + Samsung') {
          $scope.hasLandingPage = true;
          $rootScope.$broadcast('Splashscreen', display[i]);
        } else if (name == 'Portal + Samsung') {
          $rootScope.$broadcast('Portal', display[i]);
        }
      }
    }

    function changeValues(display) {
      for (var i = 0; i < display.length; i++) {
        var pageDisplay = display[i];
        var name = pageDisplay.name;
        pageDisplay.values = Object.assign(pageDisplay.values, $scope.sponsor.adValues[name]);
      }

    }

    function fetchDisplay() {
      sponsorService.getDisplay($scope.sponsor.type, $scope.sponsor.place_id, function(err, disp) {
        if (err) {
          return;
        }
        display = disp;
        $scope.hasLandingPage = false;
        if ($scope.MODE == $scope.EDIT_MODE) {
          changeValues(display);
        }
        broadcastDisplay();
      })
    }

    $scope.changeIndex = function(goingUp) {
      var href = $('a.nav-link.active').attr('href');
      index = href.substring(href.length - 1, href.length);
      if (index == 1 && goingUp) {
        fetchDisplay();
      }
    }

    $scope.getPlaces();
    getSponsorships();
  });
