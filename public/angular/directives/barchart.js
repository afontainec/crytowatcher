/* eslint-disable */
directives

  .directive('barChart', function() {
  console.log('in bar chart');
  return {
    restrict: 'E',
    template: '<div></div>',
    replace: true,
    link(scope, elem, attrs) {
      const data = JSON.parse(attrs.ngData);


      const graphData = {
        label: 'bar',
        data: data.info,
      };

      elem.css('width', '100%');
      elem.css('height', 400);
      $.plot(elem, [graphData], {
        series: {
          bars: {
            show: true,
            barWidth: 0.9,
          },
        },
        xaxis: {
          ticks: data.ticks,
        },
        grid: {
          hoverable: true,
        },
        legend: {
          show: false,
        },
        tooltip: true,
        tooltipOpts: {
          content: 'x: %x, y: %y',
        },
      });
    },
  };
});
