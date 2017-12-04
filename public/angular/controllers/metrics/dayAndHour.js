// public/javascripts/angular/controllers
/* eslint-disable */
controllers

  .controller('DayAndHourController', function($scope, $http, impressionMetrics, chartOptions) {

    var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    var weekDay = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    var hours = ['0:00', '1:00', '2:00', '3:00', '4:00', '5:00', '6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];


    $scope.YEARLY = 'Este año';
    $scope.MONTHLY = 'Este mes';
    $scope.WEEKLY = 'Última semana';

    $scope.dayView = $scope.WEEKLY;


    function plot(id, option) {
      var dom = document.getElementById(id);
      var myChart = echarts.init(dom);

      if (option && typeof option === "object") {
        myChart.setOption(option, true);
      }
    }

    function toDay(timestamp) {
      var date = new Date(timestamp);
      if ($scope.dayView != $scope.WEEKLY) {
        return date.getDate() + ' ' + months[date.getMonth()];
      }
      return weekDay[date.getDay()];

    }

    function toHour(timestamp) {
      var date = new Date(timestamp);
      return date.getHours();
    }

    function shouldGo(timestamp, index) {
      var now = new Date();
      var date = new Date(timestamp);
      if ($scope.WEEKLY == $scope.dayView) {
        return index < 8;
      }
      var sameYear = now.getFullYear() == date.getFullYear();
      var sameMonth = now.getMonth() == date.getMonth();
      if ($scope.YEARLY == $scope.dayView && sameYear) {
        return true;
      }
      if ($scope.MONTHLY == $scope.dayView && sameMonth && sameYear) {
        return true;
      }
      return false
    }

    function getData(metrics) {
      var labels = [];
      var values = [];
      for (var i = 0; i < metrics.length; i++) {
        if (shouldGo(metrics[i][0], metrics.length - i)) {
          labels.push(toDay(metrics[i][0]));
          values.push(metrics[i][1]);
        }
      }
      return {
        labels,
        values
      };
    }

    function getHourData(metrics) {
      var labels = [];
      var values = [];
      for (var i = 0; i < metrics.length; i++) {
        labels.push(hours[i]);
        values.push(metrics[i][1]);
      }
      return {
        labels,
        values
      };
    }

    function plotByDay() {
      impressionMetrics.byDay('', function(err, metrics) {
        if (err) {
          return;
        }
        var data = getData(metrics);
        var option = chartOptions.byDay;
        option.xAxis[0].data = data.labels;
        option.series[0].data = data.values;
        plot('dayGraph', option);

      });
    }

    $scope.changeDayView = function(value) {
      $scope.dayView = value;
      plotByDay();
    }

    function plotByHour() {
      impressionMetrics.byHour('', function(err, metrics) {
        if (err) {
          return;
        }
        var data = getHourData(metrics);
        var option = chartOptions.byHour;
        option.xAxis[0].data = data.labels;
        option.series[0].data = data.values;
        plot('hourGraph', chartOptions.byHour);

      });
    }


    plotByDay();
    plotByHour();

  });
