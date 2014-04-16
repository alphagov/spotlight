define([
  'common/collections/completion'
], function (CompletionCollection) {
  var CompletionRateSeries = CompletionCollection.extend({
    defaultValueAttrs: function (value) {
      return {
        completion: value._start > 0 ? value._end / value._start : null
      };
    },

    defaultCollectionAttrs: function (collection) {
      return {
        id: 'completion',
        title: 'Completion rate',
        totalCompletion: collection._start > 0 ? (collection._end / collection._start) : null,
        periods: {
          total: collection.values.length,
          available: _.filter(collection.values, function (v) { return v.get('completion') !== null; }).length
        }
      };
    }
  });

  return CompletionRateSeries;
});

