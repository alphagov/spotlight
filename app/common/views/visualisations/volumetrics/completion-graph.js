define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var VolumetricsCompletionGraph = Graph.extend({

    minYDomainExtent: 1,
    numYTicks: 3,


    getConfigNames: function () {
      var axisConfig = 'week';
      if (this.collection.options.axisPeriod) {
        axisConfig = this.collection.options.axisPeriod;
      } else if (this.collection.query.get('period')) {
        axisConfig = this.collection.query.get('period');
      }
      return ['stack', axisConfig];
    },
    
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
          options: { allowMissingData: true, drawCursorLine: true }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return VolumetricsCompletionGraph;
});
