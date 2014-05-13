define([
  'extensions/views/timeseries_graph/percentage_graph'
],
function (PercentageGraph) {
  var UptimeGraph = PercentageGraph.extend({

    getConfigNames: function () {
      return [this.collection.query.get('period')];
    },

    // use custom properties for stack calculation because
    // ResponseTimeGraph and UptimeGraph are sharing the same
    // Collection
    stackYProperty: 'yUptime',
    stackY0Property: 'yUptime0',
    outStack: function (model, y0, y) {
      model.yUptime0 = y0;
      model.yUptime = y;
    },

    valueAttr: 'uptimeFraction'

  });

  return UptimeGraph;
});
