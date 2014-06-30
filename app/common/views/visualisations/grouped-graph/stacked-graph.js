define([
  './grouped-graph',
  'extensions/views/graph/stack-set'
],
function (Graph, StackSet) {
  return Graph.extend({

    GroupClass: StackSet,

    getYPos: function (index, attr) {
      var val = Graph.prototype.getYPos.apply(this, arguments);
      val += this.getY0Pos(index, attr);
      return val;
    },

    getY0Pos: function (index, attr) {
      var lines = this.getLines();
      var found;
      return _.reduce(lines, function (sum, line) {
        if (found) {
          sum += Graph.prototype.getYPos.call(this, index, line.key);
        } else if (line.key === attr) {
          found = true;
        }
        return sum;
      }, 0, this);
    },

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
