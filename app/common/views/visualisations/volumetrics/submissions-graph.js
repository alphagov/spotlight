define([
  'common/views/visualisations/stacked-graph'
],
function (Graph) {
  var VolumetricsGraph = Graph.extend({

    numYTicks: 3,

    getConfigNames: function () {
      var axisConfig = 'week';
      if (this.collection.options.axisPeriod) {
        axisConfig = this.collection.options.axisPeriod;
      } else if (this.collection.query.get('period')) {
        axisConfig = this.collection.query.get('period');
      }
      return [axisConfig];
    },

    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        {
          view: this.sharedComponents.stack,
          options: { drawCursorLine: true }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return VolumetricsGraph;
});
