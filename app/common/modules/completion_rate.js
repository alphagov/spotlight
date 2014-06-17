define([
  'common/collections/completion_rate'
],
function (CompletionRateCollection) {
  return {
    requiresSvg: true,
    collectionClass: CompletionRateCollection,

    collectionOptions: function () {
      return {
        tabs: this.model.get('tabs'),
        valueAttr: this.model.get('value-attribute'),
        category: this.model.get('category'),
        period: this.model.get('period'),
        filterBy: this.model.get('filter-by'),
        startAt: this.model.get('start-at'),
        endAt: this.model.get('end-at'),
        queryParams: this.model.get('query-params'),
        axisPeriod: this.model.get('axis-period'),
        duration: this.model.get('duration'),
        numeratorMatcher: new RegExp(this.model.get('numerator-matcher')),
        denominatorMatcher: new RegExp(this.model.get('denominator-matcher')),
        matchingAttribute: this.model.get('matching-attribute'),
        tabbedAttr: this.model.get('tabbed_attr'),
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
