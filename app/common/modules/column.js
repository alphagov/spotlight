define([
  'extensions/collections/collection'
],
function (Collection) {
  return {
    requiresSvg: true,
    collectionClass: Collection,

    collectionOptions: function () {
      var valueAttr = this.model.get('value-attribute') || '_count';
      var options = {
        valueAttr: valueAttr
      };
      options.format = this.model.get('format') ||
        { type: 'integer', magnitude: true, sigfigs: 3, pad: true };

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
        valueAttr: '_count',
        maxBars: this.model.get('max-bars')
      };
    }
  };

});
