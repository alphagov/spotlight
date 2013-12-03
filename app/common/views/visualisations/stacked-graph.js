define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var StackedGraph = Graph.extend({

    initialize: function (options) {
      Graph.prototype.initialize.apply(this, arguments);

      this.valueAttr = this.model.get('value-attr');
    },
    
    components: function () {
      var labelComponent, labelOptions, stackOptions;

      if (this.model.get('show-line-labels')) {
        labelComponent = this.sharedComponents.linelabel;
        labelOptions = {
          showValues: true,
          showValuesPercentage: true,
          showSummary: true,
          showTimePeriod: true,
          attachLinks: this.model.get('line-label-links')
        };
        stackOptions = {
          selectGroup: false,
          allowMissingData: true,
          drawCursorLine: true,
          interactive: function (e) {
            if (this.graph.lineLabelOnTop()) {
              return e.slice >= 3;
            } else {
              return e.slice % 3 !== 2;
            }
          }
        };
      } else {
        labelComponent = this.sharedComponents.callout;
      }

      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: this.sharedComponents.stack, options: stackOptions },
        { view: labelComponent, options: labelOptions },
        { view: this.sharedComponents.hover }
      ];
    },

    getConfigNames: function () {
      return ['stack', this.collection.query.get('period') || 'week'];
    }
  });
  
  return StackedGraph;
});
