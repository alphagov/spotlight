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
        axisPeriod: this.model.get('axis-period') || this.model.get('period'),
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
              format: this.model.get('format-options') || 'integer'
            }
          ]
        }, this.model.get('axes')),
        defaultValue: this.model.get('default-value')
      };
    },

    visualisationOptions: function () {
      return {
        valueAttr: 'uniqueEvents',
        totalAttr: 'mean',
        formatOptions: this.model.get('format-options') || { type: 'number', magnitude: true, pad: true }
      };
    }

  };
});
