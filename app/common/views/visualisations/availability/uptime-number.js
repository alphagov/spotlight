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
        return "<span class='no-data'>(no data)</span>";
      } else {
        return this.formatPercentage(uptimeFraction);
      }
    },

    getValueSelected: function (selection) {
      var model = selection.selectedModel;
      var uptimeFraction = this.formatPercentage(model.get('uptimeFraction'));
      if (uptimeFraction === null) {
        return "<span class='no-data'>(no data)</span>";
      } else {
        return this.formatPercentage(uptimeFraction);
      }
    }
  });

  return UptimeNumberView;
});
