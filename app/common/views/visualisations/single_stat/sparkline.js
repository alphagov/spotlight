define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var Sparkline = Graph.extend({
    
    getConfigNames: function () {
      return ['stack', 'month']; 
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
