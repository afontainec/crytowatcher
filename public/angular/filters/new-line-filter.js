/* eslint-disable*/

filters.filter('newlines', function() {
  return function(text) {
    return text.split(/\\n/g);
  }
});
