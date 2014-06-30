define([
  './grouped-graph',
  'extensions/views/graph/stack-set'
],
function (Graph, StackSet) {
  return Graph.extend({

    GroupClass: StackSet,

    maxValue: function () {
      return this.collection.reduce(function (max, model) {
        var sum = _.reduce(this.getLines(), function (sum, line) {
          return sum + (model.get(line.key) || 0);
        }, 0, this);
        return Math.max(max, sum);
      }, 0, this);
    }

  });
});
