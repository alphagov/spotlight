define([
  'extensions/views/view',
  'common/views/visualisations/volumetrics/percentage'
],
function (View, PercentageView) {
  return View.extend({

    views: function () {
      var valueAttr = this.collection.options.valueAttr;
      var formatOptions = this.collection.options.format;

      return {
        '.impact-number': {
          view: PercentageView,
          options: {
            target: this.target,
            pinTo: this.pinTo,
            valueAttr: valueAttr,
            formatOptions: _.extend({}, formatOptions, { abbr: true })
          }
        }
      };
    }

  });
});
