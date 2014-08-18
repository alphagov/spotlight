define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var VolumetricsGraph = Graph.extend({

    minYDomainExtent: 1,
    numYTicks: 3,

    components: function () {
      var values = {};
      values = {
        xaxis: { view: this.sharedComponents.xaxis },
        yaxis: { view: this.sharedComponents.yaxis },
        stack: { view: this.sharedComponents.line },
        hover: { view: this.sharedComponents.hover },
        callout: { view: this.sharedComponents.callout }
      };
      if (this.formatOptions && this.formatOptions.type === 'duration') {
        values.yaxis.options = {};
        var self = this;
        values.yaxis.options.tickFormat = function () {
          return function (v) {
            return self.format(v, self.formatOptions);
          };
        };

        values.callout.options = {};
        values.callout.options.formatValue = function (value) {
          if (value === null) {
            return '(no-data)';
          }
          return this.format(value, this.graph.formatOptions);
        };
      }
      return values;
    }
  });

  return VolumetricsGraph;
});
