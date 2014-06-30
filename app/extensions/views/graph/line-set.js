define([
  './component',
  './line'
], function (Component, Line) {

  return Component.extend({

    GroupClass: Line,

    initialize: function () {
      Component.prototype.initialize.apply(this, arguments);
      var defaultOptions = this.graph.getDefaultComponentOptions();
      this.lines = _.map(this.graph.getLines(), function (line, i) {
        var options = _.extend(defaultOptions, {
          interactive: false,
          valueAttr: line.key,
          className: 'group' + i
        });
        return new this.GroupClass(options);
      }, this);
    },

    render: function () {
      Component.prototype.render.apply(this, arguments);
      _.each(this.lines, function (line) {
        line.render();
      });
    },

    onHover: function (e) {
      var xdiff = Infinity;
      var ydiff = Infinity;
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
        if (Math.abs(y - e.y) < ydiff) {
          ydiff = Math.abs(y - e.y);
          closestLine = line.valueAttr;
        }
      });
      this.collection.selectItem(xindex, { valueAttr: closestLine, force: true });
    }

  });

});