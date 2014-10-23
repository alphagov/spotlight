define([
  './bar-chart',
  './xaxis',
  './bar'
],
function (Graph, XAxis, Bar) {
  var BarChartGraph = Graph.extend({
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
        bar: {
          view: Bar.extend({
            showText: false
          })
        }
      };
    }
  });

  return BarChartGraph;
});
