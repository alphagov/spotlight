define([
  './component',
  './line-set',
  './stack'
], function (Component, LineSet, Stack) {

  return LineSet.extend({

    initialize: function () {
      Component.prototype.initialize.apply(this, arguments);
      var defaultOptions = this.graph.getDefaultComponentOptions();
      var lines = this.graph.getLines();
      this.lines = _.map(lines, function (line, i) {
        var options = _.extend(defaultOptions, {
          interactive: false,
          valueAttr: line.key,
          className: 'group' + i,
          baselineAttr: _.pluck(lines, 'key').slice(i + 1)
        });
        return new Stack(options);
      }, this);
    },

    onHover: function (e) {
      var xdiff = Infinity;
      var xindex;
      var closestLine;
      // Find closest point of closest group
      this.collection.each(function (model, i) {
        var x = this.lines[0].x(i);
        if (Math.abs(x - e.x) < xdiff) {
          xdiff = Math.abs(x - e.x);
          xindex = i;
        }
      }, this);

      _.each(this.lines, function (line) {
        var y = line.y(xindex);
        if (y < e.y) {
          closestLine = line.valueAttr;
        }
      });
      this.collection.selectItem(xindex, { valueAttr: closestLine, force: true });
    }

  });

});