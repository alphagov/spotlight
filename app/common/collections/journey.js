define([
  'extensions/collections/matrix',
  'common/collections/journey_series'
],
function (MatrixCollection, JourneySeriesCollection) {
  var JourneyCollection = MatrixCollection.extend({
    collections: [ JourneySeriesCollection ],

    getTableRows: function () {
      var res = MatrixCollection.prototype.getTableRows.apply(this, arguments);
      return [_.flatten(res)];
    }
  });

  return JourneyCollection;
});
