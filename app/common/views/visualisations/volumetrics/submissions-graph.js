define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var VolumetricsGraph = Graph.extend({

    numYTicks: 3,

    components: function () {
      var values = {};
      values = {
        xaxis: { view: this.sharedComponents.xaxis },
        yaxis: {
          view: this.sharedComponents.yaxis
        },
        stack: {
          view: this.sharedComponents.stack,
          options: {
            formatOptions: this.formatOptions
          }
        },
        hover: { view: this.sharedComponents.hover }
      };
      if (this.formatOptions && this.formatOptions.type === 'duration') {
        values.yaxis.options = {};
        var unit = this.formatOptions.unit;
        values.yaxis.options.tickFormat = function () {
          var format = '%-' + unit.toUpperCase() + unit;
          return d3.time.format(format);
        };
      }
      return values;
    }
  });

  return VolumetricsGraph;
});
