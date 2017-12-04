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


    $scope.sponsorships = [];

    $scope.getPlaces = function() {

      placeService.getNames(function(err, places) {
        $scope.loadingPlaces = false;
        if (err) {
          $scope.loadPlacesFailed = true;
          return;
        }
        $scope.places = places;
        $scope.sponsor.place_id = places[3].id;
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

    $scope.prepareToSave = function() {
      $(".previous").css("display", "none");
      getDates();
      $rootScope.$broadcast('readyToRecieveValues');
    }

    $scope.$on('values', function(event, data) {
      Object.assign($scope.sponsor.values, data);
      if(Object.keys($scope.sponsor.values).length === display.length) {
        save();
      }

    });

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
        console.log(data);
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
        $scope.sponsor.type = sponsorships[0].id;
      })
    }


    $scope.hasPortal = function() {
      return true;
    }

    function broadcastDisplay() {
      for (var i = 0; i < display.length; i++) {
        var name =  display[i].name;
        if( name == 'Splashscreen + Samsung') {
          $scope.hasLandingPage = true;
          $rootScope.$broadcast('Splashscreen', display[i]);
        } else if (name == 'Portal + Samsung') {
          $rootScope.$broadcast('Portal', display[i]);
        }
      }
    }

   function fetchDisplay() {
      sponsorService.getDisplay($scope.sponsor.type, $scope.sponsor.place_id, function(err, disp) {
        if(err) {
          return;
        }
        display = disp;
        $scope.hasLandingPage = false;
        broadcastDisplay();
      })
    }

    $scope.changeIndex = function (goingUp) {
      var href = $('a.nav-link.active').attr('href');
      index = href.substring(href.length - 1, href.length);
      if(index == 1 && goingUp) {
        fetchDisplay();
      }
    }

    $scope.getPlaces();
    getSponsorships();
  });
