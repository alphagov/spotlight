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
          className: 'group' + i,
          grouped: true,
          timeshift: !!line.timeshift
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
      var closestX = this.getClosestX(e);
      var closestLine = this.getClosestLine(e, closestX);
      this.collection.selectItem(closestX, { valueAttr: closestLine.valueAttr, force: true });
    },

    getClosestX: function (e) {
      var diff = Infinity;
      var index;
      // Find closest point of closest group
      this.collection.each(function (model, i) {
        var x = this.lines[0].x(i);
        var y = this.hasValueAtIndex(i);
        if (y && Math.abs(x - e.x) < Math.abs(diff)) {
          diff = x - e.x;
          index = i;
        }
      }, this);
      return index;
    },

    getInterpolator: function (e, index) {
      var interpolator;
      var diff = this.lines[0].x(index) - e.x;
      var next = diff < 0 ? index + 1 : index - 1;
      if (this.hasValueAtIndex(next)) {
        interpolator = function (line) {
          var interpx = diff / (line.x(index) - line.x(next));
          return d3.interpolateNumber(line.y(index), line.y(next))(interpx);
        };
      } else {
        interpolator = function (line) {
          return line.y(index);
        };
      }
      return interpolator;
    },

    getClosestLine: function (e, index) {
      var ydiff = Infinity;
      var closestY = {};
      var interpolator = this.getInterpolator(e, index);

      _.each(this.lines, function (line) {
        var diff = interpolator(line) - e.y;
        if (Math.abs(diff) < Math.abs(ydiff)) {
          closestY = line;
          ydiff = diff;
        }
      });

      return closestY;
    },

    hasValueAtIndex: function (i) {
      return _.any(this.lines, function (line) {
        return this.graph.getYPos(i, line.valueAttr);
      }, this);
    }

  });

});