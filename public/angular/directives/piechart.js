/*eslint-disable*/
directives

    .directive('pieChart', function () {
      return {
        restrict: 'E',
        template: '<div></div>',
        replace: true,
        link(scope, elem, attrs) {
          const data = JSON.parse(attrs.ngData);

          elem.css('width', '100%');
          elem.css('height', 400);
          $.plot(elem, data, {
            series: {
              pie: {
                show: true,
              },
            },
            grid: {
              hoverable: true,
            },
            tooltip: true,
            tooltipOpts: {
              content: '%p.0%, %s', // show percentages, rounding to 2 decimal places
              shifts: {
                x: 20,
                y: 0,
              },
            },
          });
        },
      };
    });
