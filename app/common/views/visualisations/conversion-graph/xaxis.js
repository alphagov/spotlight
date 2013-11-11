define([
  'extensions/views/graph/xaxis'
],
function (XAxis) {
  var ConversionXAxis = XAxis.extend({
    tickValues: function () {
      return _.range(this.collection.at(0).get('values').length);
    },
    tickSize: 0,
    tickPadding: 0,
    tickFormat: function () {
      var steps = this.collection.at(0).get('values');
      return function (index) {
        return steps.at(index).get('title');
      };
    }
  });

  return ConversionXAxis;
});
