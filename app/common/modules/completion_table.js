define([
  'common/modules/completion_rate',
  'common/collections/grouped_completion'
], function (CompletionRate, Collection) {
  return {
    collectionClass: Collection,
    collectionOptions: CompletionRate.collectionOptions
  };
});
