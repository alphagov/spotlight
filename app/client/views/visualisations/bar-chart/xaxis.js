define([
  'client/views/graph/xaxis'
],
function (XAxis) {
  return XAxis.extend({
    useEllipses: true,
    tickValues: function () {
      return [_.range(this.collection.length)];
    },
    tickSize: 0,
    tickPadding: 0,
    tickFormat: function () {
      if (this.axisPeriod) {
        return _.bind(function (index) {
          return this.formatPeriod(this.collection.at(index), this.axisPeriod);
        }, this);
      }
      return _.bind(function (index) {
        return this.collection.at(index).get('title');
      }, this);
    }
  });
});
