define([
  'extensions/views/graph/graph',
  './xaxis',
  './bar',
  'extensions/views/graph/hover'
],
function (Graph, XAxis, Bar, Hover) {
  var BarChartGraph = Graph.extend({
    minYDomainExtent: 1,
    numYTicks: 3,

    initialize: function (options) {
      this.valueAttr = options.valueAttr || 'uniqueEvents';
      this.axisPeriod = options.axisPeriod;
      this.formatOptions = options.formatOptions;

      Graph.prototype.initialize.apply(this, arguments);
    },

    components: function () {
      var that = this;
      return [
        {
          view: XAxis,
          options: {
            axisPeriod: this.axisPeriod
          }
        },
        {
          view: this.sharedComponents.yaxis,
          options: (this.formatOptions.type === 'percent') ? {
            tickFormat: function () {
              return function (d) {
                return that.format(d, that.formatOptions);
              };
            }
          } : {}
        },
        { view: Bar },
        { view: Hover }
      ];
    },

    getConfigNames: function () {
      return ['overlay'];
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

  return BarChartGraph;
});
