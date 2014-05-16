define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var LineGraph = Graph.extend({

    initialize: function (options) {
      options = options || {};
      options.valueAttr = this.model.get('value-attribute');
      Graph.prototype.initialize.apply(this, arguments);
    },

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
    }

  });

  return LineGraph;
});
