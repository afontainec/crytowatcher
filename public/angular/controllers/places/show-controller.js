/* eslint-disable*/
controllers

  .controller('showPlaceController', function($scope, Utils) {
    $scope.place = {};

    // Get all places
    $scope.initialize = function(place) {
      if (place) {
        $scope.place = Utils.parseJson(place);
        parseLinks();
        $('#profile_image').attr("src", $scope.place.profile_image);
        $('#cover_image').attr("src", $scope.place.cover_image);
        setSrcIframe();
      }
    };

    function parseLinks() {
      $scope.place.facebook_link = addHttp($scope.place.facebook_link);
      $scope.place.twitter_link = addHttp($scope.place.twitter_link);
      $scope.place.website_link = addHttp($scope.place.website_link);

    }

    function addHttp(link) {
      if(link && !link.startsWith('http')) {
        return 'http://' + link;
      }
      return link;
    }

    function setSrcIframe() {
      $('iframe').attr("src", '/places/' + $scope.place.id +'/hotspot?web=true');
    }


  });
