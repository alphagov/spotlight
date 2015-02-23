define([
  'require',
  './axis'
],
function (require, Axis) {

  var YAxis = Axis.extend({
    position: 'left',
    classed: 'y-axis',
    orient: 'left',
    offsetX: -8,
    getScale: function () {
      return this.scales.y;
    },
    ticks: function () {
      return this.graph.hasData() ? this.graph.numYTicks : 0;
    },
    tickFormat: function () {
      var currency = this.graph.formatOptions && this.graph.formatOptions.type === 'currency';
      if (this.scales.y.tickValueList) {
        return this.numberListFormatter(this.scales.y.tickValueList,  currency);
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
