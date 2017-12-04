/* eslint-disable */
controllers.controller('editorController', function($scope, $rootScope, editorCompiler, uploader) {

  var id;
  var file;
  $scope.values;
  $scope.FILE_CHANGED = {};

  $scope.initialize = function(eventName) {
    id = eventName;
    $scope.$on(id, function(event, data) {
      file = data;
      $scope.modifiablesKeys = editorCompiler.modifiablesValues(id, data);
      file.values['LANGUAGE'] = "ES";
      $scope.values = data.values;
      console.log($scope.values);
      $scope.compile(file, true);
      setTimeout(function() {
        $('.colorpicker-component').colorpicker();
        var $fileupload = $('#' + id + ' .file-upload');
        $fileupload.on('change', function(event) {
          readURL(this, $(this).data('key'))
        });
      }, 750);
    });
  };


  $scope.compile = function(fileToCompile, makeCurrent) {
    editorCompiler.compile(fileToCompile, function(err, data) {
      if (err) {
        return;
      }
      if (makeCurrent) {
        $scope.FILE_KEYS = data.values['FILE-KEYS']
        $scope.render();
      }
    });
  };

  $scope.recompile = function() {
    Object.assign(file.values, $scope.values);
    $scope.compile(file, true);
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
    if (key in $scope.values) {
      var value = $scope.values[key];
      value = value.replace('em', '');
      value = changeValueInDirection(value, direction)
      value = value + 'em';
      $scope.values[key] = value;
      $scope.recompile();
    }
  }

  $scope.render = function() {
    var text = file.compiledHTML;
    $(function() {
      $('#' + id + ' #iframeContainer iframe').remove();
      var iframe = $('<iframe frameborder="0" name="hotspot" id = "iframe' + id + '" class="renderIframe"> </iframe>');
      iframe.appendTo('#' + id + ' #iframeContainer');
      var iframewindow = iframe[0].contentWindow ? iframe[0].contentWindow : iframe[0].contentDocument.defaultView;
      iframewindow.document.open();
      iframewindow.document.write(text);
      iframewindow.document.close();
      document.getElementById("iframe" + id).onload = function() {
        this.contentWindow.scrollTo(0, 0);
      };
    });
  }

  $scope.fileChanged = function fileChanged(key) {
    console.log(key);
    $scope.FILE_CHANGED[key] = true;
  }


  function readURL(input, key) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function(e) {
        $scope.values[key] = e.target.result;
        $scope.recompile();
      }
      reader.readAsDataURL(input.files[0]);
    }
  }


  $scope.$on('readyToRecieveValues', function(event) {
    if (file) {
      var values = {};
      values[file.id] = editorCompiler.removeChangedFiles($scope.values, $scope.FILE_CHANGED);
      delete values[file.id].modifiables;
      values[file.id]['LANGUAGE'] = 'ES';
      $rootScope.$broadcast('values', values);
    }
  });

  $scope.$on('uploadFile', function(event, data) {
    if (file) {
      uploadFiles('sponsorships/' + data.id + '/' + file.id, data.progressBarEvent);
    }
  });

  function uploadFiles(path, eventName) {
    var filesToSend = countFilesToSend();
    if (filesToSend == 0) {
      $rootScope.$broadcast(eventName, 100);
      return;
    }
    for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
      if ($scope.FILE_CHANGED[$scope.FILE_KEYS[i]]) {
        var file = getFileFromInput($scope.FILE_KEYS[i]);
        if (file !== null) {
          var filePath = path + '/' + $scope.FILE_KEYS[i];
          uploader.uploadFile(file, filePath, function(err, response) {
            if (err) {
              console.log(err);
            }
            $rootScope.$broadcast(eventName, 100 / filesToSend);
          });
        }
      } else {}
    }
  }

  function getFileFromInput(key) {
    var file = document.getElementById(id).getElementsByClassName(key)[0].files[0];
    if (file !== null && file !== undefined) {
      return file;
    }
    return null;
  }

  function countFilesToSend() {
    var c = 0;
    for (var i = 0; i < $scope.FILE_KEYS.length; i++) {
      if ($scope.FILE_CHANGED[$scope.FILE_KEYS[i]]) {
        var file = getFileFromInput($scope.FILE_KEYS[i]);
        if (file) {
          c++;
        }
      }
    }
    return c;
  }

});
