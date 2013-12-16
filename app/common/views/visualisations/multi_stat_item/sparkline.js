define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var Sparkline = Graph.extend({
    
    minYDomainExtent: 0, 
    
    getConfigNames: function () {
      return ['overlay', 'month', 'ymin']; 
    },
    
    components: function () {
      return [
        {
          view: this.sharedComponents.line,
          options: { allowMissingData: true }
        },
        { view: this.sharedComponents.hover }
      ];
    }
  });

  return Sparkline;
});
