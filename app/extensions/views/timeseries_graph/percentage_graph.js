define([
  'require',
  'extensions/views/graph/graph'
],
function (require, Graph) {
  var PercentageGraph = Graph.extend({

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period') || 'week'];
    },

    minYDomainExtent: 1,
    numYTicks: 3,

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        {
          view: this.sharedComponents.yaxis,
          options: {
            tickFormat: function () {
              return function (d) {
                return Math.round(100 * d) + '%';
              };
            }
          }
        },
        {
          view: this.sharedComponents.stack,
          options: {
            drawCursorLine: true,
            allowMissingData: true
          }
        },
        {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: function (value) {
              value = value * 100;
              if (value !== 100) {
                value = value.toFixed(1);
              }
              return value + '%';
            }
          }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return PercentageGraph;
});
