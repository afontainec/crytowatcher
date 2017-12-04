/* eslint-disable */


directives

  .directive('dayGraph', function($http, dayChart, chartOptions, ChartUtils) {

    var title = {
      'ether_buy': `Compra ether`,
      "ether_sell": `Venta ether`,
      'btc_buy': `Compra Bitcoin`,
      "btc_sell": `Venta Bitcoin`
    }

    var addSerie = function(option, values, title) {
      var series = option.series;

      var s = JSON.parse(JSON.stringify(chartOptions.byDaySerie));
      s.name = title;
      s.data = values;
      series.push(s);
      option.legend.data.push(s.name);
    }

    var getMinValue = function (data, currency) {
      var t = Math.min(...[3, 4, 5, -1, -2]);
      var m = [Math.min(...data[`${currency}`].buy), Math.min(...data[`${currency}`].sell)];
      return Math.min(...m);
    }

    var getOptions = function(data, currency) {
      var option = JSON.parse(JSON.stringify(chartOptions.byDay));
      option.xAxis[0].data = data[`${currency}`].labels;
      addSerie(option, data[`${currency}`].buy, title[`${currency}_buy`]);
      addSerie(option, data[`${currency}`].sell, title[`${currency}_sell`]);

      option.yAxis[0].min = getMinValue(data, currency);
      return option;
    }


    var getLabels = function(data) {
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


    var plot = function(session, currency) {
      // var reducedData = reduceData(session.data);
      var option = getOptions(session.data, currency);
        console.log(session.graphId);
        var dom = document.getElementById(session.graphId);
        var myChart = echarts.init(dom);

        if (option && typeof option === "object") {
          myChart.setOption(option, true);
        }
    };

    var getValues = function(attr, session, currency, callback) {
      $http.get('/price/all').success(function(result) {
        session.data[`${currency}`] = {
          buy: [],
          sell: [],
          labels: []
        };
        for (var i = 0; i < result.length; i++) {
          session.data[`${currency}`].labels.push(new Date(result[i].created_at));
          session.data[`${currency}`].buy.push(result[i][`${currency}_buy`]);
          session.data[`${currency}`].sell.push(result[i][`${currency}_sell`]);


        }
        plot(session, currency);
      });

    }

    var makeSession = function (graphId) {
      return {
        graphId: graphId,
        visualization: dayChart.MONTHLY,
        finished : 0,
        data : {},
        }
    }

    return {
      restrict: 'E',
      template: '<div class="box">' +
        '<div class="box-header">' +
        '  <h3> Valor surBTC </h3>' +
        '  <small class="block text-muted">Todas</small>' +
        '</div>' +
        '<div class="box-tool">' +
        '  <ul class="nav">' +
        '    <li class="nav-item inline dropdown">' +
        '      <a class="nav-link" data-toggle="dropdown">' +
        '        <i class="material-icons md-18">&#xe5d4;</i>' +
        '      </a>' +
        '      <div class="dropdown-menu dropdown-menu-scale pull-right">' +
        '        <a class="dropdown-item anual" href>Este  a&ntilde;o</a>' +
        '        <a class="dropdown-item mensual"  href>Este mes</a>' +
        '        <div class="dropdown-divider"></div>' +
        '        <a class="dropdown-item semanal">&Uacute;ltima semana</a>' +
        '      </div>' +
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
        var session = makeSession(graphId);
        ChartUtils.changeTitle(elem, attrs.title);
        getValues(attrs, session, attrs.currency, function(err, metrics) {

        });
      }
    }
  });
