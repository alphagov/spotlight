define([
  'common/views/visualisations/volumetrics/completion-graph'
],
function (Graph) {
  var PercentageGraph = Graph.extend({

    components: function () {
      return Graph.prototype.components.apply(this, arguments).concat([{
        view: this.sharedComponents.tooltip,
        options: {
          formatValue: function (value) {
            value = value * 100;
            if (value !== 100) {
              value = value.toFixed(1);
            }
            return value + '%';
          }
        }
      }]);
    }
  });

  return PercentageGraph;
});
