define([
  'common/views/visualisations/bar-chart/bar-chart',
  '../bar-chart/xaxis',
  '../bar-chart/bar',
  './callout',
  'extensions/views/graph/hover'
],
function (BarChart, XAxis, Bar, Callout, Hover) {
  var JourneyGraph = BarChart.extend({

    components: function () {
      return [
        { view: XAxis },
        { view: Bar },
        { view: Callout },
        { view: Hover }
      ];
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
