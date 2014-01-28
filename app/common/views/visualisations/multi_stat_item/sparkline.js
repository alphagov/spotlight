define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var Sparkline = Graph.extend({
    
    minYDomainExtent: 0, 
    
    initialize: function (options) {
      Graph.prototype.initialize.apply(this, arguments);

      this.period = options.period;
      this.showTooltip = options.showTooltip;
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
      if (this.showTooltip) {
        var tooltipComponent = {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: function (value) {
              return this.formatNumericLabel(value);
            }
          }
        };
        val.push(tooltipComponent);
      }
      return val;
    }
  });

  return Sparkline;
});
