/* eslint-disable */

services

  .service('dayChart', function() {

    this.YEARLY = 'Este año';
    this.MONTHLY = 'Este mes';
    this.WEEKLY = 'Última semana';
    this.months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    this.weekDay = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];


    this.getData = function(metrics, visualization) {
      var data = {};
      for (var i = 0; i < metrics.length; i++) {
        if (this.shouldGo(metrics[i][0], metrics.length - i, visualization)) {
          var label =this.toDay(metrics[i][0], visualization);
          data[label] = metrics[i][1];
        }
      }
      return data;
    }

    this.toDay = function (timestamp, visualization) {
      var date = new Date(timestamp);
      if (visualization != this.WEEKLY) {
        return date.getDate() + ' ' + this.months[date.getMonth()];
      }
      return this.weekDay[date.getDay()];

    }

    this.shouldGo = function(timestamp, index, visualization) {
      var now = new Date();
      var date = new Date(timestamp);
      if (this.WEEKLY == visualization) {
        return index < 8;
      }
      var sameYear = now.getFullYear() == date.getFullYear();
      var sameMonth = now.getMonth() == date.getMonth();
      if (this.YEARLY == visualization && sameYear) {
        return true;
      }
      if (this.MONTHLY == visualization && sameMonth && sameYear) {
        return true;
      }
      return false
    }
});
