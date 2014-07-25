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
    }

  });

});
