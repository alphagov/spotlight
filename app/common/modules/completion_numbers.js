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
    requiresSvg: true,

    collectionOptions: function () {
      return {
        startMatcher: new RegExp(this.model.get('start-matcher')),
        endMatcher: new RegExp(this.model.get('end-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        valueAttr: this.model.get('value-attribute'),
        period: this.model.get("period"),
        axisPeriod: this.model.get("axis-period")
      };
    }
  });

  return CompletionNumbersModule;
});
