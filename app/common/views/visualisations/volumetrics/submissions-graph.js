define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var VolumetricsGraph = Graph.extend({

    numYTicks: 3,

    getConfigNames: function () {
      return ['stack', 'week'];
    },
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        {
          view: this.sharedComponents.stack,
          options: { allowMissingData: true, drawCursorLine: true }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return VolumetricsGraph;
});
