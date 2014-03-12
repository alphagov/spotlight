define([
  'extensions/views/graph/graph'
],
function (Graph) {
  var LineGraph = Graph.extend({

    initialize: function (options) {
      options = options || {};
      options.valueAttr = this.model.get('value-attr');
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
    },

    getConfigNames: function () {
      var axisConfig = 'week';
      if (this.collection.options.axisPeriod) {
        axisConfig = this.collection.options.axisPeriod;
      } else if (this.collection.query.get('period')) {
        axisConfig = this.collection.query.get('period');
      }
      return ['overlay', axisConfig];
    }
  });

  return LineGraph;
});
