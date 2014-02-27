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

      if (this.showStartAndEndTicks) {
        val.push({
          view: this.sharedComponents.yaxis,
          options: { showStartAndEndTicks: true }
        },
        {
          view: this.sharedComponents.yaxisRight,
          options: { showStartAndEndTicks: true }
        });
      }

      return val;
    }
  });

  return Sparkline;
});
