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
        tabs: this.model.get('tabs'),
        valueAttr: this.model.get('value-attribute'),
        category: this.model.get('category'),
        period: this.model.get('period'),
        axisPeriod: this.model.get('axis-period'),
        duration: this.model.get('duration'),
        denominatorMatcher: new RegExp(this.model.get('start-matcher')),
        numeratorMatcher: new RegExp(this.model.get('end-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        tabbedAttr: this.model.get('tabbed_attr'),
        axisLabels: this.model.get('axis-labels')
      };
    }
  });

  return CompletionRateModule;
});
