var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');
var template = requirejs('stache!common/templates/visualisations/kpi');

module.exports = View.extend({

  template: template,

  formatDate: function (period, startDate, endDate) {
    var formattedDate = '';
    if (period === 'week') {
      formattedDate = this.format([startDate, endDate], {type: 'dateRange', format: 'D MMM YYYY'});
    } else if (period === 'month') {
      formattedDate = this.format(startDate, {type: 'date', format: 'MMMM YYYY'});
    } else {
      formattedDate = this.format([startDate, endDate], {type: 'dateRange', format: 'MMM YYYY', subtract: 'months'});
    }
    return formattedDate;
  },

  templateContext: function () {

    var current = this.collection.at(0),
      previous = this.collection.at(1),
      valueAttr = this.model.get('value-attribute'),
      format = this.model.get('format') || { type: 'number' },
      datePeriod = this.model.get('date-period');

    format.abbr = true;

    if (!current) {
      return {};
    }

    var config = {
      hasValue: current.get(valueAttr) !== null && current.get(valueAttr) !== undefined,
      value: this.format(current.get(valueAttr), format)
    };

    if (current.get('_timestamp') && current.get('end_at')) {
      _.extend(config, {
          period: this.formatDate(datePeriod, current.get('_timestamp'), current.get('end_at'))
        }
      );
    }

    if (previous && previous.get(valueAttr)) {
      _.extend(config, {
        previousPeriod: {
          period: this.formatDate(datePeriod, previous.get('_timestamp'), previous.get('end_at')),
          value: this.format(previous.get(valueAttr), format)
        }
      });
    }

    if (config.hasValue && previous && previous.get(valueAttr)) {
      var sgn;
      if (current.get(valueAttr) / previous.get(valueAttr) > 1) {
        sgn = 'increase';
      } else if (current.get(valueAttr) / previous.get(valueAttr) < 1) {
        sgn = 'decrease';
      } else {
        sgn = 'no-change';
      }
      _.extend(config, {
        change: this.format(current.get(valueAttr) / previous.get(valueAttr) - 1, { type: 'percent', dps: 2, pad: true, showSigns: true }),
        sgn: sgn
      });
    }

    return _.extend(View.prototype.templateContext.apply(this, arguments), config);
  }
});
