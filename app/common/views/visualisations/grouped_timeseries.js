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
      var cumulative = this.model.get('cumulative'),
          graph = cumulative ? StackedGraph : LineGraph;

      return {
        '.categories': { 
          view: graph, 
            options: { 
              "currency": this.model.get('currency') 
            }
        }
      };
    }
  });

  return CategoriesView;
});
