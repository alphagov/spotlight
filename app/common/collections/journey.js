define([
  'extensions/collections/matrix',
  'common/collections/journey_series'
],
function (MatrixCollection, JourneySeriesCollection) {
  var JourneyCollection = MatrixCollection.extend({
    collections: [ JourneySeriesCollection ],

    queryParams: function () {
      return {
        filter_by: this.options.filterBy ? this.options.filterBy : []
      };
    },

    getTableRows: function () {
      var res = MatrixCollection.prototype.getTableRows.apply(this, arguments);
      return [_.flatten(res)];
    }
  });

  return JourneyCollection;
});
