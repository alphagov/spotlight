define([
  'common/collections/completion_rate'
],
function (CompletionRateCollection) {
  return {
    requiresSvg: true,
    collectionClass: CompletionRateCollection,

    collectionOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute'),
        category: this.model.get('category'),
        axisPeriod: this.model.get('axis-period'),
        numeratorMatcher: new RegExp(this.model.get('numerator-matcher')),
        denominatorMatcher: new RegExp(this.model.get('denominator-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        axes: _.merge({
          x: {
            label: 'Date of completion',
            key: ['_start_at', '_end_at'],
            format: 'dateRange'
          },
          y: [
            {
              label: 'Completion percentage',
              key: 'completion',
              format: 'percent'
            }
          ]
        }, this.model.get('axes'))
      };
    },

    visualisationOptions: function () {
      return {
        valueAttr: 'completion',
        totalAttr: 'totalCompletion'
      };
    }

  };
});
