define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var Sparkline = Graph.extend({

    minYDomainExtent: 0,
    numYTicks: 1,

    initialize: function (options) {
      Graph.prototype.initialize.apply(this, arguments);
      this.showTooltip = options.showTooltip;
      this.showStartAndEndTicks = options.showStartAndEndTicks;
    },

    modelToDate: function (model) {
      return model.get('_timestamp');
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
      return this.collection.min(this.valueAttr) || 0;
    }

  });

  return Sparkline;
});
