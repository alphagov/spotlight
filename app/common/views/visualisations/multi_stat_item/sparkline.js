define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var Sparkline = Graph.extend({

    minYDomainExtent: 0,
    numYTicks: 1,

    initialize: function (options) {
      Graph.prototype.initialize.apply(this, arguments);
      this.period = options.period;
      this.showTooltip = options.showTooltip;
      this.showStartAndEndTicks = options.showStartAndEndTicks;
    },

    getPeriod: function () {
      return this.period || this.model.get('period') || 'hour';
    },

    components: function () {
      var val = {
        line: {
          view: this.sharedComponents.line
        },
        hover: { view: this.sharedComponents.hover }
      };

      if (this.showStartAndEndTicks) {
        val.yaxis = {
          view: this.sharedComponents.yaxis,
          options: { showStartAndEndTicks: true }
        };

        val.yaxisRight = {
          view: this.sharedComponents.yaxisRight,
          options: { showStartAndEndTicks: true }
        };
      }

      return val;
    },

    minValue: function () {
      var d3 = this.d3;
      var valueAttr = this.valueAttr;
      var min = d3.min(this.collection.toJSON(), function (group) {
        return d3.min(group.values.toJSON(), function (value) {
          return value[valueAttr];
        });
      }) || 0;
      return min;
    },


  });

  return Sparkline;
});
