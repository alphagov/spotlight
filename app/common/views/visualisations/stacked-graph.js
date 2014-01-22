define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var StackedGraph = Graph.extend({

    initialize: function (options) {
      Graph.prototype.initialize.apply(this, arguments);
      if (this.model && this.model.get('value-attr')) {
        this.valueAttr = this.model.get('value-attr');
      }
    },

    interactiveFunction: function (e) {
      if (this.graph.lineLabelOnTop()) {
        return e.slice >= 3;
      } else {
        return e.slice % 3 !== 2;
      }
    },
    
    components: function () {
      var labelComponent, labelOptions, stackOptions, yAxisOptions, tooltipFormat;

      if (this.showLineLabels()) {
        labelComponent = this.sharedComponents.linelabel;
        labelOptions = {
          showValues: true,
          showValuesPercentage: true,
          showSummary: true,
          showTimePeriod: true,
          attachLinks: this.model.get('line-label-links')
        };
        stackOptions = {
          selectGroup: true,
          encompassStack: true,
          allowMissingData: true,
          drawCursorLine: true,
          interactive: this.interactiveFunction
        };
      } else {
        labelComponent = this.sharedComponents.callout;
      }

      if (this.model && this.model.get('one-hundred-percent')) {
        yAxisOptions = {
          tickFormat: function(){
            return function(d){
              return d * 100 + "%";
            };
          }
        };
        tooltipFormat = function(d){
          return Math.round(d * 100) + "%";
        };
      } else {
        tooltipFormat = function(d){
          return this.formatNumericLabel(d);
        };
      }

      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis, options: yAxisOptions },
        { view: this.sharedComponents.stack, options: stackOptions },
        { view: labelComponent, options: labelOptions },
        { view: this.sharedComponents.hover },
        {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: tooltipFormat,
            encompassStack: true,
            noTotal: true
          }
        }
      ];
    },

    encompassStack: true,

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period') || 'week'];
    }
  });
  
  return StackedGraph;
});
