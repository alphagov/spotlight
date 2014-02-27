define([
  'require',
  './axis'
],
function (require, Axis) {

  var YAxis = Axis.extend({
    position: 'left',
    classed: 'y-axis',
    ticks: 7,
    orient: 'left',
    initialize: function () {
      Axis.prototype.initialize.apply(this, arguments);
      if (this.graph.numYTicks != null) {
        this.ticks = this.graph.numYTicks;
      }
    },
    getScale: function () {
      return this.scales.y;
    },
    tickFormat: function () {
      return this.numberListFormatter(this.scales.y.tickValueList, this.graph.currency);
    },
    tickValues: function () {
      if (this.graph.showStartAndEndTicks) {
        var ticks = this.scales.y.tickValueList;
        return [[0, ticks[ticks.length - 1]]];
      }
      return null;
    }
  });

  return YAxis;
});
