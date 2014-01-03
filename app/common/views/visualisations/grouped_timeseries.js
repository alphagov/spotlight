define([
  'tpl!common/templates/visualisations/categories.html',
  'extensions/views/view',
  'extensions/views/tabs',
  'common/views/visualisations/stacked-graph',
  'common/views/visualisations/line-graph'
],
function (template, View, Tabs, StackedGraph, LineGraph) {
  var CategoriesView = View.extend({
    template: template,
      
    views: function () {
      var cumulative = this.model.get('cumulative'),
          graph = cumulative ? StackedGraph : LineGraph;
          
      var val = {
            '.categories': { view: graph }
          };
          
      if (this.model && this.model.get('tabbed_attr')) {
        console.log('tabbed_attr', this.model.get('tabbed_attr'));
        val["#categories-nav"] = {
           view: Tabs,
           options: function (){
             return {
               model: this.collection.query,
               attr: this.model.get('tabbed_attr'),
               tabs: this.model.get('tabs')
             };
           }
        };        
      }

      return val;
    }
  });

  return CategoriesView;
});
