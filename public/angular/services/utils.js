/* eslint-disable */
services

  .service('Utils', function() {

  this.parseJson = function(string) {
    string = jsonEscape(string);
    return JSON.parse(string);

  }

  this.copyJSON = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function jsonEscape(str) {
    var s = str.split('"');
    var res = s[0]
    for (var i = 1; i < s.length; i++) {
      if (!Number.isInteger(i / 2)) {
        s[i] = s[i].replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
      }
      res += '"' + s[i]
    }
    return res
  }

  this.pushNotNull = function(array, value) {
    if (value !== null) {
      array.push(value);
    }
  }

  // Recieves json object and return a string as ?key1=value1&key2=value2
  this.toQueryString = function (json) {
    if(!json) {
      return "";
    }
    var keys = Object.keys(json);
    var query = '?';
    for (var i = 0; i < keys.length; i++) {
      if(i != 0) {
        query += '&';
      }
      query += keys[i] + '=' + json[keys[i]];
    }
    return query;
  }

  this.daysFromNow = function (date) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(date);
    var secondDate = new Date();
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
  }
});
