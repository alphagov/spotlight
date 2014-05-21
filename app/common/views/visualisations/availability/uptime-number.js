define([
  'require',
  './response-time-number'
],
function (require, ResponseTimeNumberView) {
  var UptimeNumberView = ResponseTimeNumberView.extend({

    labelPrefix: '',

    getValue: function () {
      var uptimeFraction = this.collection.getFractionOfUptime();
      if (isNaN(uptimeFraction)) {
        return '<span class="no-data">(no data)</span>';
      } else {
        return this.format(uptimeFraction, 'percent');
      }
    },

    getValueSelected: function (selection) {
      var model = selection.selectedModel;
      var uptimeFraction = this.format(model.get('uptimeFraction'), 'percent');
      if (uptimeFraction === null) {
        return '<span class="no-data">(no data)</span>';
      } else {
        return this.format(uptimeFraction, 'percent');
      }
    }
  });

  return UptimeNumberView;
});
