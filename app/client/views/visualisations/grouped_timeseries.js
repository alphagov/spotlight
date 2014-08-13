define([
  'extensions/views/view',
  'client/views/visualisations/grouped-graph/stacked-graph',
  'client/views/visualisations/grouped-graph/line-graph'
],
function (View, StackedGraph, LineGraph) {
  var CategoriesView = View.extend({

    views: function () {
      var useStack = this.model.get('use_stack'),
          graph = useStack ? StackedGraph : LineGraph;

      return {
        '.categories': {
          view: graph,
          options: {
            currency: this.currency,
            valueAttr: this.valueAttr
          }
        }
      };

    }
  });

  return CategoriesView;
});
