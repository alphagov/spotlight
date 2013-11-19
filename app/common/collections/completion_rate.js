define([
  'extensions/collections/matrix',
  'common/collections/completion_rate_series'
],
function (MatrixCollection, CompletionRateSeriesCollection) {
  var CompletionRateCollection = MatrixCollection.extend({
    collections: [ CompletionRateSeriesCollection ]
  });

  return CompletionRateCollection;
});
