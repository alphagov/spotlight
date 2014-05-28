define([
  'common/views/visualisations/stacked-graph'
],
function (Graph) {
  var ResponseTimeGraph = Graph.extend({

    valueAttr: 'avgresponse',
    numYTicks: 3,

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis,
          options: {
            tickFormat: function () {
              return _.bind(function (d) {
                return this.format(d, {
                  type: 'duration',
                  unit: 's'
                });
              }, this);
            }
          }
          },
          {
            view: this.sharedComponents.stack,
            options: {
              drawCursorLine: true
            }
          },
          {
            view: this.sharedComponents.tooltip,
            options: {
              formatValue: function (value) {
                return this.format(value, {
                  type: 'duration',
                  unit: 's'
                });
              }
            }
          },
          { view: this.sharedComponents.hover }
        ];
    }

  });

  return ResponseTimeGraph;
});
