define([
  'tpl!common/templates/visualisations/categories.html',
  'extensions/views/view',
  'common/views/visualisations/stacked-graph',
  'common/views/visualisations/line-graph'
],
function (template, View, StackedGraph, LineGraph) {
  var CategoriesView = View.extend({
    template: template,

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
