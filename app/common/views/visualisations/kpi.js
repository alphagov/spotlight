define([
  'extensions/views/view',
  'extensions/mixins/formatters',
  'stache!common/templates/visualisations/kpi'
],
function (View, Formatters, template) {

  return View.extend({

    template: template,

    templateContext: function () {

      var current = this.collection.at(0),
        previous = this.collection.at(1),
        valueAttr = this.model.get('value-attribute'),
        format = this.model.get('format') || 'number',
        dateFormat = { type: 'dateRange', format: 'MMM YYYY', subtract: 'months'},
        datePeriod = this.model.get('date-period');

      if (datePeriod && datePeriod === 'week') {
        dateFormat.format = 'D MMM YYYY';
        delete dateFormat.subtract;
      }

      if (!current) {
        return {};
      }

      var config = {
        hasValue: current.get(valueAttr) !== null && current.get(valueAttr) !== undefined,
        value: this.format(current.get(valueAttr), format)
      };

      if (current.get('_timestamp') && current.get('end_at')) {
        _.extend(config, {
          period: this.format([
              current.get('_timestamp'),
              current.get('end_at')
            ], dateFormat)
          }
        );
      }

      if (previous && previous.get(valueAttr)) {
        _.extend(config, {
          previousPeriod: {
            period: this.format([
              previous.get('_timestamp'),
              previous.get('end_at')
            ], dateFormat),
            value: this.format(previous.get(valueAttr), format)
          }
        });
      }

      if (config.hasValue && previous) {
        _.extend(config, {
          change: this.format(current.get(valueAttr) / previous.get(valueAttr) - 1, { type: 'percent', dps: 2 }),
          sgn: current.get(valueAttr) / previous.get(valueAttr) > 1 ? 'increase' : 'decrease'
        });
      }

      return config;
    },

    format: Formatters.format

  });

});
