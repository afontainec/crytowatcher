/* eslint-disable */

services

  .service('ChartUtils', function() {
    this.changeTitle = function(elem, title) {
      if (title) {
        $(elem).find('.box-header h3').text(title);
      }
    }

    this.changeGraphId = function(elem, id) {
      $(elem).attr('id', id + 'Container');
      if (id) {
        $(elem).find('.box-body div').attr('id', id);
        return id;
      }
      return null;
    }

    this.parseParams = function(sponsor_id, display) {
      var param = {}
      sponsor_id ? param.sponsor_id = sponsor_id : param;
      if (display && display.length > 0) {
        param.display = display;
      }
      return param;
    }
});
