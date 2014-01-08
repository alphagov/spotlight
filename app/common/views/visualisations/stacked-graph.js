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
      var labelComponent, labelOptions, stackOptions;

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

      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: this.sharedComponents.stack, options: stackOptions },
        { view: labelComponent, options: labelOptions },
        { view: this.sharedComponents.hover },
        {
          view: this.sharedComponents.tooltip,
          options: {
            formatValue: function (value) {
              return this.formatNumericLabel(value);
            },
            encompassStack: true
          }
        }
      ];
    },

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period') || 'week'];
    }
  });
  
  return StackedGraph;
});
