define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var VolumetricsGraph = Graph.extend({

    numYTicks: 3,

    components: function () {
      return {
        xaxis: { view: this.sharedComponents.xaxis },
        yaxis: { view: this.sharedComponents.yaxis },
        stack: {
          view: this.sharedComponents.stack,
          options: { drawCursorLine: true }
        },
        hover: { view: this.sharedComponents.hover }
      };
    }
  });

  return VolumetricsGraph;
});
