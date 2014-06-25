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
    }

  });

  return CompletionNumbersSeries;
});
