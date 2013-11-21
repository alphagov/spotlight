define([
  'extensions/controllers/module',
  'common/views/visualisations/completion_numbers',
  'common/collections/completion_numbers'
],
function (ModuleController, CompletionNumbersView, CompletionNumbersCollection) {
  var CompletionNumbersModule = ModuleController.extend({
    className: 'completion_numbers',
    visualisationClass: CompletionNumbersView,
    collectionClass: CompletionNumbersCollection,
    clientRenderOnInit: true,

    collectionOptions: function () {
      return {
        startMatcher: /start$/,
        endMatcher: /done$/,
        matchingAttribute: "eventCategory"
      };
    }
  });

  return CompletionNumbersModule;
});
