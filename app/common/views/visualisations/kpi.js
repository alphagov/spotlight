define([
  'extensions/views/view',
  'stache!common/templates/visualisations/kpi'
],
function (View, template) {

  return View.extend({

    template: template,

    templateContext: function () {

      var current = this.collection.at(0),
        previous = this.collection.at(1),
        valueAttr = this.model.get('valueAttr'),
        format = this.model.get('format') || 'number',
        dateFormat = { type: 'date', format: 'MMM YYYY' },
        datePeriod = this.model.get('date-period');

      if (datePeriod && datePeriod === 'week') {
        dateFormat.format = 'D MMM YYYY';
      }

      if (!current) {
        return {};
      }

      var config = {
        hasValue: current.get(valueAttr) !== null && current.get(valueAttr) !== undefined,
        value: this.format(current.get(valueAttr), format),
      };

      if (current.get('_timestamp') && current.get('end_at')) {
        _.extend(config, {
          period: {
            start: this.format(current.get('_timestamp'), dateFormat),
            end: this.format(current.get('end_at'), dateFormat)
          }
        });
      }

      if (config.hasValue && previous) {
        _.extend(config, {
          change: this.format(current.get(valueAttr) / previous.get(valueAttr) - 1, { type: 'percent', dps: 2 }),
          sgn: current.get(valueAttr) / previous.get(valueAttr) > 1 ? 'increase' : 'decrease',
          previousPeriod: {
            start: this.format(previous.get('_timestamp'), dateFormat),
            end: this.format(previous.get('end_at'), dateFormat)
          }
        });
      }

      return config;
    }

  });

});
