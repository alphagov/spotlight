define([
  './grouped-graph',
  'client/views/graph/line-set'
],
function (Graph, LineSet) {

  return Graph.extend({

    GroupClass: LineSet,

    minYDomainExtent: 0,

    maxValue: function () {
      return _.reduce(this.getLines(), function (max, line) {
        return Math.max(max, this.collection.max(line.key) || 0);
      }, 0, this);
    }

  });

});
