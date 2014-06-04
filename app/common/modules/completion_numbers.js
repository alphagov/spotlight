define([
  'common/collections/completion_numbers'
],
function (CompletionNumbersCollection) {
  return {
    collectionClass: CompletionNumbersCollection,

    collectionOptions: function () {
      return {
        numeratorMatcher: new RegExp(this.model.get('numerator-matcher')),
        denominatorMatcher: new RegExp(this.model.get('denominator-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        valueAttr: this.model.get('value-attribute'),
        period: this.model.get('period'),
        startAt: this.model.get('start-at'),
        endAt: this.model.get('end-at'),
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
        duration: this.model.get('duration'),
        defaultValue: this.model.get('default-value')
      };
    },

    visualisationOptions: function () {
      return {
        valueAttr: this.model.get('value-attribute') || 'uniqueEvents',
        totalAttr: this.model.get('total-attribute') || 'mean'
      };
    }

  };
});
