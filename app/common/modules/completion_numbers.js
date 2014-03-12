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
        numeratorMatcher: new RegExp(this.model.get('numerator-matcher')),
        denominatorMatcher: new RegExp(this.model.get('denominator-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        valueAttr: this.model.get('value-attribute'),
        period: this.model.get('period'),
        axisPeriod: this.model.get('axis-period'),
        axes: _.merge({
          x: {
            label: 'Date of Application',
            key: ['_start_at', '_end_at'],
            format: 'dateRange'
          },
          y: [
            {
              label: 'Number of applications',
              key: 'uniqueEvents',
              format: 'integer'
            }
          ]
        }, this.model.get('axes')),
        duration: this.model.get('duration')
      };
    }
  });

  return CompletionNumbersModule;
});
