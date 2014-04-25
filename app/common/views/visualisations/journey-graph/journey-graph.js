define([
  'common/views/visualisations/bar-chart/bar-chart',
  '../bar-chart/xaxis',
  '../bar-chart/bar',
  './callout',
  'extensions/views/graph/hover'
],
function (BarChart, XAxis, Bar, Callout, Hover) {
  var JourneyGraph = BarChart.extend({

    valueAttr: 'uniqueEvents',

    components: function () {
      return [
        { view: XAxis },
        { view: Bar },
        { view: Callout },
        { view: Hover }
      ];
    },

    getConfigNames: function () {
      return [];
    }
  });

  return JourneyGraph;
});
