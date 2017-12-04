/* eslint-disable */

services

  .service('uploader', function($http) {

    var canceled = false;

    this.uploadFile = function(file, path, callback) {
      var that = this;
      this.getSignedRequest(file, path, function(err, response) {
        if (err) {
          return callback(err);
        }
        that.upload(file, response.signedRequest, response.url, function(err) {
          if (err) {
            return callback(err);
          }
          callback(null, {"message": "File uploaded successfully"});
        });
      });
    }

    this.getSignedRequest = function(file, filePath, callback) {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `/sign-s3?file-name=${filePath}&file-type=${file.type}`);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
            return
          } else {
            callback("Unable to get signedRequest");
          }
        }
      };
      xhr.send();
    }

    this.upload = function(file, signedRequest, url, callback) {
      if (!canceled) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              callback(null);
            } else {
              return callback('Could not upload file.');
            }
          }
        };
        xhr.send(file);
      }
    }
  });
