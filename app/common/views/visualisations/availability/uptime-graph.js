define([
  'extensions/views/timeseries_graph/percentage_graph'
],
function (PercentageGraph) {
  var UptimeGraph = PercentageGraph.extend({

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period')];
    },

    prepareGraphArea: function () {

      var graphWrapper = this.graphWrapper = $('<div class="graph-wrapper"></div>');
      graphWrapper.appendTo(this.$el);

      this.innerEl = $('<div class="inner"></div>');
      this.innerEl.appendTo(graphWrapper);
      
      var svg = this.svg = this.d3.select(graphWrapper[0]).append('svg');
      
      this.wrapper = svg.append('g')
        .classed('wrapper', true);
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
