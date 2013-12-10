define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var Sparkline = Graph.extend({
    
    minYDomainExtent: 0, 
    
    getConfigNames: function () {
      return ['stack', 'month', 'ymin']; 
    },
    
    components: function () {
      return [
        {
          view: this.sharedComponents.line,
          options: { allowMissingData: true, drawCursorLine: true }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return Sparkline;
});
