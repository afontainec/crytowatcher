/* eslint-disable */
controllers.controller('hotspotController', function($scope, $http, $window, $location, Utils, placeService) {

  $scope.i = 1; // current_step
  $scope.selectedHotspot; // name, description and that stuff
  $scope.places;
  $scope.loadingPlaces = true;
  $scope.loadPlacesFailed = false;
  $scope.completed = 0;
  $scope.CURRENT_TEMPLATE = 'LANDING-PAGE';
  $scope.FILE_KEYS = [];
  var FILE_CHANGED = {}
  $scope.uploading = false;

  $scope.current_hotspot = {
    values: {},
    template: {}
  }



  function changeJSValues() {
    $scope.selectedHotspot.values['ACTIVITY-CATCHER'] = '$ACTIVITY-CATCHER$';
    $scope.selectedHotspot.values['VISIT-COUNTER'] = '$VISIT-COUNTER$';
  }

  // Get all places
  $scope.initializeHotspot = function(hotspot, where) {
    $scope.selectedHotspot = Utils.parseJson(hotspot);
    if (where == 'create') {
      $scope.getTemplate($scope.CURRENT_TEMPLATE, true);
    } else {
      $scope.CURRENT_TEMPLATE = $scope.selectedHotspot.template;
      changeJSValues();
      $scope.getTemplate($scope.CURRENT_TEMPLATE, true, $scope.selectedHotspot.values);
    }

  };

  function toggleClass(id, className) {
    $(function() {
      $('#' + id.toString()).toggleClass(className);
    });
  }

  function allowedToGoToNextStep() {
    if ($scope.i >= 3) {
      return false;
    }
    if ($scope.i == 1 && !($scope.selectedHotspot.place_id && $scope.selectedHotspot.name)) {
      return false;
    }
    return true
  }

  $scope.nextStep = function() {
    if (allowedToGoToNextStep()) {

      var className = "btn-outline";
      toggleClass($scope.i, className);
      $scope.i += 1;
      toggleClass($scope.i, className);
      if ($scope.i == 2) {
        toggleClass('previous', 'hidden');
      }
      if ($scope.i == 3) {
        toggleClass('next', 'hidden');
      }
    }
  }

  $scope.previousStep = function() {
    if ($scope.i > 1) {
      var className = "btn-outline";
      toggleClass($scope.i, className);
      $scope.i -= 1;
      toggleClass($scope.i, className);
      if ($scope.i == 1) {
        toggleClass('previous', 'hidden');
      }
      if ($scope.i == 2) {
        toggleClass('next', 'hidden');
      }
    }
  }

  $scope.porcentageWatcher = function(watcher, watchee) {
    $scope.$watch('current_hotspot.values["' + watchee + '"]', function() {
      if ($scope.current_hotspot.values[watchee]) {
        $scope[watcher] = $scope.current_hotspot.values[watchee].slice(0, -1);
      }
    });
  }

  $scope.pathWatcher = function(watcher, watchee) {
    $scope.$watch('current_hotspot.values["' + watchee + '"]', function() {
      if ($scope.current_hotspot.values[watchee]) {
        var parts = $scope.current_hotspot.values[watchee].split('://');
        $scope[watcher] = parts[1];
      }
    });
  }



  $scope.getPlaces = function() {

    placeService.getNames(function(err, places) {
      $scope.loadingPlaces = false;
      if (err) {
        $scope.loadPlacesFailed = true;
        return;
      }
      $scope.places = places;
    })
  }

  $scope.getPlaces();
  // -------------------------------------------TEMPLATE AREA ------------------------------------------------
  TEMPLATES = {};



  function initializeTemplate(temp) {
    TEMPLATES[temp] = {
      template: "",
      defaultValues: "",
      compiledHTML: "",
    }
  }

  $scope.changeTemplate = function() {
    $scope.CURRENT_TEMPLATE = $scope.SELECTED_TEMPLATE;
    $scope.getTemplate($scope.CURRENT_TEMPLATE, true);

  }

  $scope.cancelChange = function() {
    $scope.SELECTED_TEMPLATE = $scope.CURRENT_TEMPLATE;
  }

  $scope.openModal = function() {
    $(function() {
      $modal = $('#myModal');
      $modal.modal('show');
    });
  }

  // getTemplate
  $scope.getTemplate = function(template, makeCurrent, defaultValues) {
    // alreadyLoaded ?
    if (!TEMPLATES[template]) {
      $http.get('/hotspots/template/' + template)
        .success(function(data) {
          initializeTemplate(template);
          TEMPLATES[template].template = data.htmlData;
          TEMPLATES[template].values = defaultValues ? defaultValues : Utils.parseJson(data.defaultValues);
          $scope.compile(TEMPLATES[template], makeCurrent);
        })
        .error(function(error) {
          console.log(error);
        });
    } else {
      $scope.compile(TEMPLATES[template], makeCurrent);
    }
  };

  $scope.compile = function(fileToCompile, makeCurrent) {
    var temp = fileToCompile.template;
    keys = Object.keys(fileToCompile.values);
    for (var i = 0; i < keys.length; i++) {
      var inTextKey = "\\$" + keys[i] + "\\$";
      var search = new RegExp(inTextKey, 'g')
      temp = temp.replace(search, fileToCompile.values[keys[i]]);
    }
    fileToCompile.compiledHTML = temp;
    if (makeCurrent) {
      $scope.FILE_KEYS = fileToCompile.values['FILE-KEYS']
      $scope.current_hotspot = fileToCompile;
      $scope.renderHotspot();
    }
  };

  $scope.renderHotspot = function() {
    var text = $scope.current_hotspot.compiledHTML;
    $(function() {
      $('#hotspot').remove();
      var iframe = $('<iframe frameborder="0" name="hotspot" id="hotspot"> </iframe>');
      iframe.appendTo('#hotspotContainer');
      var iframewindow = iframe[0].contentWindow ? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
      iframewindow.document.open();
      iframewindow.document.write(text);
      iframewindow.document.close();
    });
  }

  $scope.recompile = function(key, value, temporaryChange) {
    if (key in $scope.current_hotspot.values) {
      $scope.current_hotspot.values[key] = value;
    }
    $scope.compile($scope.current_hotspot, true);
  }

  function changeValueInDirection(value, direction) {
    var diff = 0.1;
    if (direction === 'up') {
      return (parseFloat(value, 10) + diff).toFixed(2);
    } else {
      return (parseFloat(value, 10) - diff).toFixed(2);

    }
  }
  $scope.recompileSize = function(key, direction) {
    if (key in $scope.current_hotspot.values) {
      var value = $scope.current_hotspot.values[key];
      value = value.replace('em', '');
      value = changeValueInDirection(value, direction)
      value = value + 'em';
      $scope.current_hotspot.values[key] = value;
    }
    $scope.compile($scope.current_hotspot, true);
  }

  $scope.fileChanged = function fileChanged(key) {
    FILE_CHANGED[key] = true;
  }

  function parseValuesToSend() {
    temp = $scope.current_hotspot.values;
    for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
      if (FILE_CHANGED[$scope.FILE_KEYS[i]]) {
        temp[$scope.FILE_KEYS[i]] = null;
      }
    }
    return temp;
  }

  $scope.updateHotspot = function() {
    sendFile('/hotspots/' + $scope.selectedHotspot.id + '/update');

  }

  $scope.saveHotspot = function() {
    sendFile('/hotspots/save/');
  }

  function sendFile(path) {
    $scope.completed = 0;
    $scope.uploading = true;
    canceled = false;
    $scope.selectedHotspot.is_active = true;
    var values = parseValuesToSend();
    $scope.selectedHotspot.template = $scope.CURRENT_TEMPLATE;
    $http.post(path, {
        template_id: $scope.CURRENT_TEMPLATE,
        hotspotInfo: $scope.selectedHotspot,
        template: $scope.current_hotspot.template,
        values: values,
      })
      .success(function(data) {
        changeCompleted(10);
        var path = data.imageFolder;
        uploadFiles(path);
      })
      .error(function(error) {});
  }


  var filesToSend = 0;
  var uploadedFiles = 0;

  function countFilesToSend() {
    var c = 0;
    for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
      if (FILE_CHANGED[$scope.FILE_KEYS[i]]) {
        var file = document.getElementById($scope.FILE_KEYS[i]).files[0];
        if (file !== null && file !== undefined) {
          c += 1;
        }
      }
    }
    return c;
  }

  function uploadFiles(path) {
    filesToSend = countFilesToSend();
    uploadedFiles = 0;
    if (!canceled) {
      progressPerFile = 80 / $scope.FILE_KEYS.length;
      for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
        if (FILE_CHANGED[$scope.FILE_KEYS[i]]) {
          var file = document.getElementById($scope.FILE_KEYS[i]).files[0];
          if (file !== null && file !== undefined) {
            var filePath = path + $scope.FILE_KEYS[i];
            getSignedRequest(file, filePath, progressPerFile);
          }
        } else {
          uploadedFiles += 1;
          changeCompleted(progressPerFile, true);

        }
      }
    }
  }

  function getSignedRequest(file, filePath, increment) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/sign-s3?file-name=${filePath}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          changeCompleted(increment / 2);
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url, increment / 2);
        } else {
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  function uploadFile(file, signedRequest, url, progress) {
    if (!canceled) {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', signedRequest);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            uploadedFiles += 1;
            changeCompleted(progress, true);
          } else {
            alert('Could not upload file.');
          }
        }
      };
      xhr.send(file);
    }
  }

  $scope.changeBackgroundImage = function(key) {}

  function changeCompleted(increment, endable) {
    $scope.completed += increment;
    $scope.$apply();
    if (uploadedFiles == filesToSend && endable) {
      $scope.uploading = false;
      $window.location.href = '/hotspots/';

    }
  }

  $scope.cancelUpload = function() {
    canceled = true;
    $scope.uploading = false;

  }

  $scope.$watch('CURRENT_TEMPLATE', function() {
    $scope.SELECTED_TEMPLATE = $scope.CURRENT_TEMPLATE;
  });
});
