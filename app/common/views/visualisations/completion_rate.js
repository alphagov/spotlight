define([
  'extensions/views/view',
  'common/views/visualisations/volumetrics/number'
],
function (View, VolumetricsNumberView) {
  return View.extend({

    views: function () {
      return {
        '.volumetrics-completion-selected': {
          view: VolumetricsNumberView,
          options: {
            valueAttr: this.valueAttr,
            formatOptions: 'percent'
          }
        }
      };
    }

  });
});
