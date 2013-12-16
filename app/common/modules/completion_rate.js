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
    requiresSvg: true,

    collectionOptions: function () {
      return {
        startMatcher: new RegExp(this.model.get('start-matcher')),
        endMatcher: new RegExp(this.model.get('end-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        valueAttribute: this.model.get('value-attribute')
      };
    }
  });

  return CompletionRateModule;
});
