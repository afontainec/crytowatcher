/* eslint-disable */
controllers

  .controller('showSponsorController', function($scope, Utils, placeService, editorCompiler, sponsorService) {


    $scope.names = [];

    $scope.sponsor = {};
    $scope.place = {};
    $scope.initialize = function (sponsor) {
        $scope.sponsor = JSON.parse(sponsor);
        $('#adProfileImage').attr("src", $scope.sponsor.profile_image);
        $('#adCoverImage').attr("src", $scope.sponsor.cover_image);
        getPlace();
        getNames();
    }


    function getPlace() {
      placeService.get($scope.sponsor.place_id, function(err, place) {
        if(err) {
          return;
        }
        $scope.place = place;
      });
    }

    function getNames() {
      sponsorService.getNames($scope.sponsor.id, function(err, names) {
        if(err) {
          return;
        }
        names.sort(function(a, b) {
          if(a === 'login.html') {
            return -1;
          }
            return 1;
        });
        $scope.names = names;
        setTimeout(function () {
          for (var i = 0; i < names.length; i++) {
            var id = $scope.getiFrameId(names[i]);
            $('#' + id).attr("src", "/sponsorship/" + $scope.sponsor.id + "/render?filename=" + names[i]);
          }
        }, 1000);
      });
    }


    $scope.getiFrameId = function(name) {
      const id = name.split('.')[0];
      return id;
    }


  });
