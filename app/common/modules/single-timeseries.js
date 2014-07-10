define([
  'common/collections/single-timeseries'
],
function (Collection) {
  return {
    requiresSvg: true,
    collectionClass: Collection,

    collectionOptions: function () {
      return {
        numeratorMatcher: new RegExp(this.model.get('numerator-matcher')),
        denominatorMatcher: new RegExp(this.model.get('denominator-matcher')),
        matchingAttribute: this.model.get('group-by'),
        valueAttr: this.model.get('value-attribute') || 'uniqueEvents',
        period: this.model.get('period') || this.model.get('axis-period'),
        startAt: this.model.get('start-at'),
        endAt: this.model.get('end-at'),
        filterBy: this.model.get('filter-by'),
        axisPeriod: this.model.get('axis-period') || this.model.get('period'),
        queryParams: this.model.get('query-params'),
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
        valueAttr: 'uniqueEvents',
        totalAttr: 'mean'
      };
    }

  };
});
