define([
  './line-set',
  './stack'
], function (LineSet, Stack) {

  return LineSet.extend({

    GroupClass: Stack,

    getClosestLine: function (e, index) {
      var closestY = { valueAttr: null };
      if (this.hasValueAtIndex(index)) {
        var interpolator = this.getInterpolator(e, index);

        _.each(this.lines, function (line) {
          if (interpolator(line) < e.y) {
            closestY = line;
          }
        });
      }

      return closestY;
    }

  });

});