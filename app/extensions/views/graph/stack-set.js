define([
  './line-set',
  './stack'
], function (LineSet, Stack) {

  return LineSet.extend({

    GroupClass: Stack,

    getClosestLine: function (e, x) {
      var closestY = this.lines[0];
      var interpolator = this.getInterpolator(e, x);

      _.each(this.lines, function (line) {
        if (interpolator(line) < e.y) {
          closestY = line;
        }
      });

      return closestY;
    }

  });

});