define([
  'extensions/views/graph/xaxis'
],
function (XAxis) {
  var JourneyXAxis = XAxis.extend({
    useEllipses: true,
    tickValues: function () {
      return [_.range(this.collection.at(0).get('values').length)];
    },
    tickSize: 0,
    tickPadding: 0,
    tickFormat: function () {
      var steps = this.collection.at(0).get('values');
      if (this.axisPeriod) {
        var that = this;
        return function (index) {
          return that.formatPeriod(steps.at(index), that.axisPeriod);
        };
      }
      return function (index) {
        return steps.at(index).get('title');
      };
    }
  });

  return JourneyXAxis;
});
