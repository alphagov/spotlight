define([
  'common/collections/completion'
], function (CompletionCollection) {
  var CompletionNumbersSeries = CompletionCollection.extend({
    defaultValueAttrs: function (value) {
      var val = value._end;
      if (value._end === null && this.options.defaultValue !== undefined) {
        val = this.options.defaultValue;
      }
      return {
        uniqueEvents: val
      };
    },

    defaultCollectionAttrs: function (collection) {
      var available = _.filter(collection.values, function (v) { return v.get('uniqueEvents') !== null; }).length;
      return {
        id: 'done',
        title: 'Done',
        mean: available > 0 ? collection._end / available : null,
        periods: {
          total: collection.values.length,
          available: available
        }
      };
    }
  });

  return CompletionNumbersSeries;
});
