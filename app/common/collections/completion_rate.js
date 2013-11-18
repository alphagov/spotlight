define([
  'extensions/collections/matrix',
  'common/collections/completion_series'
],
function (MatrixCollection, CompletionSeriesCollection) {
  var CompletionRateCollection = MatrixCollection.extend({
    collections: [ CompletionSeriesCollection ]
  });

  return CompletionRateCollection;
});
