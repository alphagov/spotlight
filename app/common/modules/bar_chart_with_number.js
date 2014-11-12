define([
  'extensions/collections/collection'
],
function (Collection) {
  return {
    requiresSvg: true,
    collectionClass: Collection,

    collectionOptions: function () {
      var valueAttr = this.model.get('value-attribute') || 'uniqueEvents:sum';
      var options = {
        valueAttr: valueAttr,
        axisPeriod: this.model.get('axis-period') || 'week'
      };
      options.format = this.model.get('format') ||
        { type: 'integer', magnitude: true, sigfigs: 3, pad: true };

      options['dataSource'] = _.extend({}, this.model.get('data-source'), {'query-params': _.extend({'flatten': true}, this.model.get('data-source')['query-params'])});

      options.axes = _.merge({
          x: {
            label: 'Dates',
            key: ['_start_at', 'end_at'],
            format: 'date'
          },
          y: [
            {
              label: 'Number of applications',
              key: valueAttr,
              format: options.format
            }
          ]
        }, this.model.get('axes'));
      return options;
    },

    visualisationOptions: function () {
      return {
        valueAttr: 'uniqueEvents',
        formatOptions: this.model.get('format'),
        maxBars: 6
      };
    }
  };

});
