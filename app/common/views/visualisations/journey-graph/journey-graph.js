define([
  'extensions/views/graph/graph',
  './xaxis',
  './bar',
  './callout',
  'extensions/views/graph/hover'
],
function (Graph, XAxis, Bar, Callout, Hover) {
  var JourneyGraph = Graph.extend({

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
    },

    getXPos: function (groupIndex, modelIndex) {
      return modelIndex;
    },

    getYPos: function () {
      return this.configs.overlay.getYPos.apply(this, arguments) || 0;
    },

    calcXScale: function () {
      var xScale = this.d3.scale.linear();
      var count = this.collection.at(0).get('values').length;
      var halfBarWidth = this.innerWidth / count / 2;
      xScale.domain([0, count - 1]);
      xScale.range([halfBarWidth + 1, this.innerWidth - halfBarWidth - 1]);
      return xScale;
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
