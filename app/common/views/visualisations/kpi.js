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
        valueAttr = this.model.get('valueAttr'),
        dateFormat = { type: 'date', format: 'MMM YYYY' };

      return {
        value: this.format(current.get(valueAttr), this.model.get('format')),
        period: {
          start: this.format(current.get('_timestamp'), dateFormat),
          end: this.format(current.get('end_at'), dateFormat)
        },
        change: this.format(current.get(valueAttr) / previous.get(valueAttr) - 1, { type: 'percent', dps: 2 }),
        sgn: current.get(valueAttr) / previous.get(valueAttr) > 1 ? 'increase' : 'decrease',
        previousPeriod: {
          start: this.format(previous.get('_timestamp'), dateFormat),
          end: this.format(previous.get('end_at'), dateFormat)
        }
      };
    },

    format: Formatters.format

  });

});
