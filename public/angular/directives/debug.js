/* eslint-disable */


directives

  .directive('debug', function(impressionMetrics, dayChart, chartOptions, ChartUtils) {

    return {
      restrict: 'E',
      template: '<div class="box"> SOY DEBUG </div>',
      replace: true,

      link: function(scope, elem, attrs) {
        $(elem).attr('id', attrs.a);
        console.log('---------------------------------');
        var dom = document.getElementById(attrs.a);
        dom.innerHTML = attrs.b;

      }
    }
  });
