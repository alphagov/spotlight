define([
  'extensions/views/single_stat'
],
function (SingleStatView) {
  var ResponeTimeNumberView = SingleStatView.extend({

    changeOnSelected: true,

    labelPrefix: 'mean ',

    config: {
      hour: {
        label: '24 hours',
        selectionFormat: function (start, end) {
          return [
            start.format('ha'),
            ' to ',
            end.format('ha'),
            ',<br>',
            start.format('D MMMM YYYY')
          ].join('');
        }
      },

      day: {
        label: '30 days',
        selectionFormat: function (start, end) {
          return start.format('D MMMM YYYY');
        }
      }
    },

    getValue: function () {
      var averageResponse = this.collection.getAverageResponseTime();
      if (averageResponse === null) {
        return "<span class='no-data'>(no data)</span>";
      } else {
        return this.formatDuration(Math.round(averageResponse), 4);
      }
    },

    getValueSelected: function (selection) {
      var responseTime = selection.selectedModel.get('avgresponse');
      if (responseTime === null) {
        return "<span class='no-data'>(no data)</span>";
      } else {
        return this.formatDuration(responseTime, 4);
      }
    },

    getLabel: function () {
      var period = this.collection.query.get('period');

      return this.labelPrefix + 'for the last ' + this.config[period].label;
    },

    getLabelSelected: function (selection) {
      var model = selection.selectedModel;
      var start = model.get('_start_at');
      var end = model.get('_end_at');
      var period = this.collection.query.get('period');

      return this.config[period].selectionFormat(start, end);
    }
  });

  return ResponeTimeNumberView;
});
