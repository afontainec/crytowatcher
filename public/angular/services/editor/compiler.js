/* eslint-disable */

services

  .service('editorCompiler', function($http, Utils, MV_SERVER) {

    var server = MV_SERVER;

    TEMPLATES = {};

    initializeTemplate = function(temp) {
      TEMPLATES[temp] = {
        template: "",
        defaultValues: "",
        compiledHTML: "",
      }
    }

    // getTemplate
    this.getTemplate = function(template, defaultValues, callback) {
      // alreadyLoaded ?
      if (!TEMPLATES[template]) {
        $http.get('/hotspots/template/' + template)
          .success(function(data) {
            initializeTemplate(template);
            TEMPLATES[template].template = data.htmlData;
            TEMPLATES[template].values = defaultValues ? defaultValues : Utils.parseJson(data.defaultValues);
            callback(null, TEMPLATES[template]);
          })
          .error(function(error) {
            callback(error);
          });
      } else {
        callback(null, TEMPLATES[template]);

      }
    };

    this.compile = function(fileToCompile, callback) {
      var temp = fileToCompile.html;
      keys = Object.keys(fileToCompile.values);
      for (var i = 0; i < keys.length; i++) {
        var inTextKey = "\\$" + keys[i] + "\\$";
        var search = new RegExp(inTextKey, 'g')
        temp = temp.replace(search, fileToCompile.values[keys[i]]);
      }
      fileToCompile.compiledHTML = temp;
      callback(null, fileToCompile);
    };

    this.removeChangedFiles = function(obj, changedFiles) {
      values = Utils.copyJSON(obj);
      keys = Object.keys(changedFiles);
      for (var i = 0; i < keys.length; i++) {
        delete values[keys[i]];
      }
      values.FILE_CHANGED = keys;
      return values;
    };


    var attributeOrder = {
      'Splashscreen': {
        "BACKGROUND-IMAGE": {
          label: 'Fondo',
          position: 1,
          type: 'file'
        },
        "IMAGE-PATH": {
          label: 'Logo',
          position: 2,
          type: 'file'
        },
        "MAIN-TEXT-ES": {
          label: 'Texto principal',
          position: 3,
          type: 'text'
        },
        "MAIN-TEXT-COLOR": {
          label: 'Color principal',
          position: 4,
          type: 'color'
        },
        "MAIN-TEXT-SIZE": {
          label: 'Tamaño',
          position: 5,
          type: 'size'
        },
        "SECOND-TEXT-ES": {
          label: 'Bajada',
          position: 6,
          type: 'text'
        },
        "SECOND-TEXT-COLOR": {
          label: 'Color bajada',
          position: 7,
          type: 'color'
        },
        "SECOND-TEXT-SIZE": {
          label: 'Tamaño',
          position: 8,
          type: 'size'
        },
        "BUTTON-COLOR": {
          label: 'Color del botón',
          position: 9,
          type: 'color'
        },
        "BUTTIO-TEXT-COLOR": {
          label: 'Color del texto del botón',
          position: 10,
          type: 'color'
        }
      },
      'Portal': {
        "BANNER-PATH": {
          label: 'Imagen superior',
          position: 1,
          type: 'file'
        },
        "IMAGE-PATH": {
          label: 'Imagen',
          position: 2,
          type: 'file'
        },
        "MAIN-TEXT-ES": {
          label: 'Texto principal',
          position: 3,
          type: 'text'
        },
        "MAIN-TEXT-COLOR": {
          label: 'Color principal',
          position: 4,
          type: 'color'
        },
        "SECOND-TEXT-ES": {
          label: 'Bajada',
          position: 5,
          type: 'text'
        },
        "SECOND-TEXT-COLOR": {
          label: 'Color bajada',
          position: 6,
          type: 'color'
        },
        "BUTTON-COLOR": {
          label: 'Color del botón',
          position: 7,
          type: 'color'
        },
        "BUTTON-TEXT-ES": {
          label: 'Texto del botón',
          position: 8,
          type: 'text'
        },
        "BUTTON-TEXT-COLOR": {
          label: 'Color del texto del botón',
          position: 9,
          type: 'color'
        }
      }
    }

    this.modifiablesValues = function(template, data) {
      var array = [];
      var keys = data.values.modifiables;
      for (var i = 0; i < keys.length; i++) {
        if (attributeOrder[template][keys[i]]) {
          var entry = attributeOrder[template][keys[i]];
          if (entry.type !== 'text') {
            entry.key = keys[i];
          } else {
            entry.key = keys[i].substring(0, keys[i].length - 2);

          }
          array.push(entry);
        }
      }
      array.sort((a, b) => {
        return a.position - b.position;
      })
      return array;
    }


  });
