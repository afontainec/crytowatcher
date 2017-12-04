/* eslint-disable*/
controllers

  .controller('newPlaceController', function($scope, $window, Utils, placeService, uploader, hotspotTemplateService) {

    $scope.hotspotTemplate = '0';
    $scope.place = {
      is_active: true,
      location: '-33.4876785,-70.78158'
    };


    var DEFAULT = {
      'profile_image': '/vendor/envato/assets/images/c6.jpg',
      'cover_image': '/vendor/envato/assets/images/c4.jpg',
    }

    var uploaded = 0;

    $scope.uploading = false;

    $scope.save = function() {
      uploaded = 0;
      $scope.uploading = true;
      var profileImage = getFile('profile_image');
      var coverImage = getFile('cover_image');
      addFilePath(profileImage, coverImage);
      var param = {
        place: $scope.place,
        hotspotType: $scope.hotspotTemplate
      };
      placeService.save(param, function(err, place) {
        if (err) {
          return console.log(err);
        }
        var path = 'places/' + place.id + '/';
        upload(profileImage, 'profile_image', path);
        upload(coverImage, 'cover_image', path);
      });
    };


    function upload(file, name, path) {
      if (file) {
        uploader.uploadFile(file, path + name, uploadEnd);
      } else {
        uploadEnd(null, null);
      }
    }

    function uploadEnd(err, response) {
      if (err) {
        return err;
      }
      uploaded++;
      if (uploaded == 2) {
        $window.location.href = '/places';
      }
    }

    function addFilePath(profileImage, coverImage) {
      if (profileImage == null) {
        $scope.place.profile_image = DEFAULT.profile_image;
      }
      if (coverImage == null) {
        $scope.place.cover_image = DEFAULT.cover_image;
      }
    }

    function getFile(id) {
      return document.getElementById(id).files[0];

    }

    var jsonFormat = true;
    hotspotTemplateService.all(jsonFormat, function (err, templates) {
      if(err) {
        return err;
      }
      $scope.hotspotTemplates = templates;
    })

  });
