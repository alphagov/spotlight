define([
  'client/views/visualisations/bar-chart/bar-chart',
  'client/views/visualisations/bar-chart/xaxis',
  'client/views/visualisations/bar-chart/bar',
  './journey-graph/callout',
  'extensions/views/graph/hover'
],
function (BarChart, XAxis, Bar, Callout, Hover) {
  var JourneyGraph = BarChart.extend({

    components: function () {
      return {
        xaxis: { view: XAxis },
        bar: { view: Bar },
        callout: { view: Callout },
        hover: { view: Hover }
      };
    },

    calcYScale: function () {
      var max = this.collection.max(this.valueAttr) || 1;
      var yScale = this.d3.scale.linear();
      yScale.domain([0, max]);
      yScale.range([this.innerHeight, 0]);
      return yScale;
    }

  });

  return JourneyGraph;
});
