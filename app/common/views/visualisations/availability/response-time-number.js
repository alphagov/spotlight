define([
  'common/views/visualisations/volumetrics/number'
],
function (NumberView) {
  return NumberView.extend({

    valueAttr: 'avgresponse',
    labelPrefix: 'mean ',

    formatOptions: {
      type: 'duration',
      unit: 's'
    },

    formatValue: function (value) {
      if (value === null) {
        return '<span class="no-data">(no data)</span>';
      } else {
        return NumberView.prototype.formatValue.apply(this, arguments);
      }
    }

  });

});
