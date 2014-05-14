define([
  'require',
  './axis'
],
function (require, Axis) {

  var YAxis = Axis.extend({
    position: 'left',
    classed: 'y-axis',
    orient: 'left',
    getScale: function () {
      return this.scales.y;
    },
    ticks: function () {
      return this.graph.hasData() ? this.graph.numYTicks : 0;
    },
    tickFormat: function () {
      if (this.scales.y.tickValueList) {
        return this.numberListFormatter(this.scales.y.tickValueList, this.graph.currency);
      }
    },
    tickValues: function () {
      if (this.graph.showStartAndEndTicks && this.scales.y.tickValueList) {
        var ticks = this.scales.y.tickValueList;
        return [[0, ticks[ticks.length - 1]]];
      }
      return null;
    }
  });

  return YAxis;
});
