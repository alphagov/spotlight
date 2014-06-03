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
      return {
        axis: { view: this.sharedComponents.xaxis },
        yaxis: { view: this.sharedComponents.yaxis },
        linelabel: { view: this.sharedComponents.linelabel },
        line: {
          view: this.sharedComponents.line,
          options: {
            interactive: function (e) {
              return e.slice % 3 !== 2;
            }
          }
        },
        callout: { view: this.sharedComponents.callout },
        hover: { view: this.sharedComponents.hover }
      };
    }

  });

  return LineGraph;
});
