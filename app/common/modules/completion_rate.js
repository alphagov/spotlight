define([
  'extensions/controllers/module',
  'common/views/visualisations/completion_rate',
  'common/collections/completion_rate'
],
function (ModuleController, CompletionRateView, CompletionRateCollection) {
  var CompletionRateModule = ModuleController.extend({
    className: 'completion_rate',
    visualisationClass: CompletionRateView,
    collectionClass: CompletionRateCollection,
    clientRenderOnInit: true,

    collectionOptions: function () {
      return {
        startMatcher: /start$/,
        endMatcher: /done$/,
        matchingAttribute: "eventCategory"
      };
    }
  });

  return CompletionRateModule;
});
