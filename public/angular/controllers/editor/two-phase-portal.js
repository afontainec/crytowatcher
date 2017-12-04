/* eslint-disable */
controllers.controller('editorTwoPhasePController', function($scope, $rootScope, $http, $window, $location, Utils, editorCompiler, uploader) {

  $scope.CURRENT_TEMPLATE = 'TWO-PHASE-PORTAL';
  var id = 'hotspot_2';
  var container = 'hotspotContainer_2';

  $scope.language = "ES";

  $scope.FILE_KEYS = [];
  var FILE_CHANGED = {}

  $scope.current_hotspot = {
    values: {},
    template: {}
  }

  // -------------------------------------------TEMPLATE AREA ------------------------------------------------
  TEMPLATES = {};

  // $scope.cancelChange = function() {
  //   $scope.SELECTED_TEMPLATE = $scope.CURRENT_TEMPLATE;
  // }
  //
  // $scope.openModal = function() {
  //   $(function() {
  //     $modal = $('#myModal');
  //     $modal.modal('show');
  //   });
  // }

  // getTemplate
  $scope.initialize = function(makeCurrent, defaultValues) {
    // alreadyLoaded ?
    editorCompiler.getTemplate($scope.CURRENT_TEMPLATE, defaultValues, function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      $scope.compile(data, makeCurrent);
    });
  };

  $scope.compile = function(fileToCompile, makeCurrent) {
    editorCompiler.compile(fileToCompile, function(err, data) {
      if (err) {
        return;
      }
      if (makeCurrent) {
        $scope.FILE_KEYS = data.values['FILE-KEYS'];
        $scope.current_hotspot = data;
        $scope.renderHotspot();
      }
    });
  };

  $scope.renderHotspot = function() {
    var text = $scope.current_hotspot.compiledHTML;
    $(function() {
      $('#' + id).remove();
      var iframe = $('<iframe frameborder="0" name="hotspot" id="' + id + '" class="renderIframe"  scrolling="yes"> </iframe>');
      iframe.appendTo('#' + container);
      var iframewindow = iframe[0].contentWindow ? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
      iframewindow.document.open();
      iframewindow.document.write(text);
      iframewindow.document.close();
      document.getElementById(id).onload = function() {
        this.contentWindow.scrollTo(12, 0);
      };
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
      return (parseFloat(value, 10) + diff).toFixed(1);
    } else {
      return (parseFloat(value, 10) - diff).toFixed(1);

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


  // UPLOAD ------------------------------------------------------------------------------------

$scope.$on('readyToRecievePortalValues', function (event, data) {
  $scope.current_hotspot.values["LANGUAGE"] = "ES";
  var values = editorCompiler.removeChangedFiles($scope.current_hotspot.values, FILE_CHANGED);
  $rootScope.$broadcast('portalValues', values);
});

  $scope.$on('uploadFile', function(event, data) {

    uploadFiles('advertisement/' + data.id + '/TWO-PHASE-PORTAL/', data.progressBarEvent);
  });

  function uploadFiles(path, eventName) {
    var filesToSend = countFilesToSend();

    if (filesToSend == 0) {
      $rootScope.$broadcast(eventName, 100);
      return;
    }
    for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
      if (FILE_CHANGED[$scope.FILE_KEYS[i]]) {
        var elemId = $scope.CURRENT_TEMPLATE + "-" + $scope.FILE_KEYS[i];
        var file = document.getElementById(elemId).files[0];
        if (file !== null && file !== undefined) {
          var filePath = path + $scope.FILE_KEYS[i];
          uploader.uploadFile(file, filePath, function(err, response) {
            if (err) {
              console.log(err);
            }
            $rootScope.$broadcast(eventName, 100 / filesToSend);
          });
        }
      } else {

      }
    }
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

  function countFilesToSend() {
    var c = 0;
    for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
      if (FILE_CHANGED[$scope.FILE_KEYS[i]]) {
        var elemId = $scope.CURRENT_TEMPLATE + "-" + $scope.FILE_KEYS[i];
        var file = document.getElementById(elemId).files[0];
        if (file !== null && file !== undefined) {
          c += 1;
        }
      }
    }
    return c;
  }

  $scope.initialize(true);
});
