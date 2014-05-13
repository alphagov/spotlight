define([
  'common/views/visualisations/stacked-graph'
],
function (Graph) {
  var ResponseTimeGraph = Graph.extend({

    valueAttr: 'avgresponse',
    numYTicks: 3,

    getConfigNames: function () {
      return [this.collection.query.get('period')];
    },

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis,
          options: {
            tickFormat: function () {
              return function (d) {
                return ResponseTimeGraph.prototype.formatDuration(d, 's', 2);
              };
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
                return this.formatDuration(value, 's', 2);
              }
            }
          },
          { view: this.sharedComponents.hover }
        ];
    }

  });

  return ResponseTimeGraph;
});
