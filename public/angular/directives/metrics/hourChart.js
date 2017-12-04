/* eslint-disable */


directives

  .directive('hourGraph', function(impressionMetrics, hourChart, chartOptions, ChartUtils) {

    var finished = 0;
    var N;
    var data = {};
    var graphId;
    var title = {
      "": 'Total',
      "login.html": 'Splashscreen',
      "banner": 'Portal superior',
      "initial_portal": "Portal",
      "swiper_portal": "Portal en carrusel"
    }

    var addSerie = function(option, values, title) {
      var series = option.series;

      var s = JSON.parse(JSON.stringify(chartOptions.byHourSerie));
      s.name = title;
      s.data = values;
      series.push(s);
      option.legend.data.push(s.name);
    }
    var getOptions = function(data) {
      var option = JSON.parse(JSON.stringify(chartOptions.byHour));
      option.xAxis[0].data = data.labels;
      var dataSet = Object.keys(data.values);
      for (var i = 0; i < dataSet.length; i++) {
        var values = data.values[dataSet[i]];
        addSerie(option, values, title[dataSet[i]]);

      }
      return option;
    }
    var changeTitle = function(elem, title) {
      if (title) {
        $(elem).find('.box-header h3').text(title);
      }
    }

    var changeGraphId = function(elem, id) {
      $(elem).attr('id', id + 'Container');
      if (id) {
        $(elem).find('.box-body div').attr('id', id);
        graphId = id;
      }
    }

    var getLabels = function() {
      var keys = Object.keys(data);
      var labels = [];
      for (var i = 0; i < keys.length; i++) {
        var l = Object.keys(data[keys[i]]);
        if (l.length > labels.length) {
          labels = l;
        }
      }
      return labels;
    }

    var reduceData = function() {
      var labels = hourChart.hours;

      return {
        labels,
        values: data
      };
    }

    var plot = function(err, metrics) {
      var reducedData = reduceData();
      var option = getOptions(reducedData);
        var dom = document.getElementById(graphId);
        var myChart = echarts.init(dom);

        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        }
    };


    var impressionsOfDisplay = function(sponsor_id, display) {
      var params = ChartUtils.parseParams(sponsor_id, display);
      impressionMetrics.byHour(params, function(err, metrics) {
        if (err) {
          return err;
        }
        finished++;
        data[display] = hourChart.getData(metrics);
        if (finished == N) {
          plot();
        }
      });
    }

    var getValues = function(attr, callback) {
      var displays = attr.displays.split(';');
      N = displays.length;
      for (var i = 0; i < displays.length; i++) {
        impressionsOfDisplay(attr.sponsor, displays[i]);
      }
    }

    return {
      restrict: 'E',
      template: '<div class="box">' +
        '<div class="box-header">' +
        '  <h3>Impresiones por hora</h3>' +
        '  <small class="block text-muted"><br/></small>' +
        '</div>' +
        '<div class="box-tool">' +
        '  <ul class="nav">' +
        '    <li class="nav-item inline dropdown">' +
        '    </li>' +
        '  </ul>' +
        '</div>' +
        '<div class="box-body">' +
        '   <div style="height:300px"></div>' +
        '</div>' +
        '</div>',
      replace: true,

      link: function(scope, elem, attrs) {
        graphId = ChartUtils.changeGraphId(elem, attrs.id);
        ChartUtils.changeTitle(elem, attrs.title);
        getValues(attrs, function(err, metrics) {

        });
      }
    }
  });
