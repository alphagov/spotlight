define([
  'extensions/views/view',
  'common/views/visualisations/stacked-graph',
  'common/views/visualisations/line-graph'
],
function (View, StackedGraph, LineGraph) {
  var CategoriesView = View.extend({

    views: function () {
      var useStack = false,//this.model.get('use_stack'),
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
