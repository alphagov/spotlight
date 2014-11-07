define([
  'common/collections/single-timeseries'
],
function (Collection) {
  return {
    requiresSvg: true,
    hasDatePicker: true,
    collectionClass: Collection,

    collectionOptions: function () {
      var options = {};
      options.numeratorMatcher = new RegExp(this.model.get('numerator-matcher')),
      options.denominatorMatcher = new RegExp(this.model.get('denominator-matcher')),
      options.matchingAttribute = this.model.get('group-by'),
      options.valueAttr = this.model.get('value-attribute') || 'uniqueEvents',
      options.axisPeriod = this.model.get('axis-period') || this.model.get('period'),
      options.axes = _.merge({
        x: {
          label: 'Date of Application',
          key: ['_start_at', '_end_at'],
          format: 'date'
        },
        y: [
          {
            label: 'Number of applications',
            key: 'uniqueEvents',
            format: this.model.get('format-options') || 'integer'
          }
        ]
      }, this.model.get('axes')),

      options.defaultValue = this.model.get('default-value')
      return options;
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
