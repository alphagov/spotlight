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
      this.showEndTicks = options.showEndTicks;
    },

    getConfigNames: function () {
      return ['overlay', this.period || 'month', 'ymin'];
    },

    components: function () {
      var val = [
        {
          view: this.sharedComponents.line,
          options: { allowMissingData: true }
        },
        { view: this.sharedComponents.hover }
      ];

      if (this.showEndTicks) {
        val.push({
          view: this.sharedComponents.yaxis
        },
        {
          view: this.sharedComponents.yaxisRight
        });
      }

      return val;
    }
  });

  return Sparkline;
});
