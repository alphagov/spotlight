define([
  './line-set',
  './stack'
], function (LineSet, Stack) {

  return LineSet.extend({

    GroupClass: Stack,

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