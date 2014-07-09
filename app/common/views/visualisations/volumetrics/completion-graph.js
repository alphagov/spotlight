define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var VolumetricsCompletionGraph = Graph.extend({

    minYDomainExtent: 1,
    numYTicks: 3,

    components: function () {
      return {
        xaxis: { view: this.sharedComponents.xaxis },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: {
            tickFormat: function () {
              return function (d) {
                return Math.round(100 * d) + '%';
              };
            }
          }
        },
        stack: {
          view: this.sharedComponents.stack
        },
        hover: { view: this.sharedComponents.hover }
      };
    }
  });

  return VolumetricsCompletionGraph;
});
