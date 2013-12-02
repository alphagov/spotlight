define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var MultiTimeseriesGraph = Graph.extend({
    
    components: function () {
      return [
        { view: this.sharedComponents.xaxis },
        { view: this.sharedComponents.yaxis },
        { view: this.sharedComponents.linelabel },
        {
          view: this.sharedComponents.line,
          options: {
            interactive: function (e) {
              return e.slice % 3 !== 2;
            }
          }
        },
        { view: this.sharedComponents.callout },
        { view: this.sharedComponents.hover }
      ];
    },
    
    getConfigNames: function () {
      return ['overlay', this.collection.query.get('period') || 'week'];
    }
  });

  return MultiTimeseriesGraph;
});

