define([
  'require',
  './response-time-number'
],
function (require, ResponseTimeNumberView) {
  return ResponseTimeNumberView.extend({

    valueAttr: 'uptimeFraction',
    labelPrefix: '',
    formatOptions: 'percent'

  });

});
