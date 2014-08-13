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
    formatOptions: 'integer',

    components: function () {
      var that = this;
      return {
        xaxis: {
          view: XAxis,
          options: {
            axisPeriod: this.axisPeriod
          }
        },
        yaxis: {
          view: this.sharedComponents.yaxis,
          options: (this.formatOptions === 'percent' || this.formatOptions.type === 'percent') ? {
            tickFormat: function () {
              return function (d) {
                return that.format(d, that.formatOptions);
              };
            }
          } : {}
        },
        bar: { view: Bar },
        hover: { view: Hover }
      };
    },

    getXPos: function (groupIndex, modelIndex) {
      return modelIndex;
    },

    getYPos: function () {
      return Graph.prototype.getYPos.apply(this, arguments) || 0;
    },

    calcXScale: function () {
      var xScale = this.d3.scale.linear();
      var count = this.collection.length;
      var halfBarWidth = this.innerWidth / count / 2;
      xScale.domain([0, count - 1]);
      xScale.range([halfBarWidth + 1, this.innerWidth - halfBarWidth - 1]);
      return xScale;
    }
  });

  return BarChartGraph;
});
