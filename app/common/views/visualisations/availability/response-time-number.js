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
        selectionFormat: function (start) {

          return [
            start.format('dddd'),
            ' <span class="fulldate">',
            start.format('D MMMM YYYY'),
            '</span>'
          ].join('');
        }
      }
    },

    getValue: function () {
      var averageResponse = this.collection.getAverageResponseTime();
      if (averageResponse === null) {
        return '<span class="no-data">(no data)</span>';
      } else {
        return this.format(averageResponse, {
          type: 'duration',
          unit: 's'
        });
      }
    },

    getValueSelected: function (selection) {
      var responseTime = selection.selectedModel.get('avgresponse');
      if (responseTime === null) {
        return '<span class="no-data">(no data)</span>';
      } else {
        return this.format(responseTime, {
          type: 'duration',
          unit: 's'
        });
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
