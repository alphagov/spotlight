define([
  'common/collections/completion'
], function(CompletionCollection) {
  var CompletionNumbersSeries = CompletionCollection.extend({
    defaultValueAttrs: function (value){
      return {
        uniqueEvents: value._end
      };
    },

    defaultCollectionAttrs: function(collection){
      var available = _.filter(collection.values, function(v){ return v.get('uniqueEvents') !== null; }).length;
      return {
        id: "done",
        title: "Done",
        mean: collection._end / available,
        weeks: {
          total: collection.values.length,
          available: available
        }
      };
    }
  });

  return CompletionNumbersSeries;
});

