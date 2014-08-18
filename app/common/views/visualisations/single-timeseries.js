define([
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number'
],
function (View, VolumetricsNumberView) {
  return View.extend({

    views: function () {
      var period = this.collection.getPeriod() || 'week';
      return {
        '.volumetrics-completion-selected': {
          view: VolumetricsNumberView,
          options: {
            valueAttr: this.valueAttr,
            labelPrefix: 'mean per ' + period + ' over the',
            formatOptions: this.formatOptions
          }
        }
      };
    }

  });
});
