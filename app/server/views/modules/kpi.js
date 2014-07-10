var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');
var template = requirejs('stache!common/templates/visualisations/kpi');

module.exports = View.extend({

  template: template,

  templateContext: function () {

    var current = this.collection.at(0),
      previous = this.collection.at(1),
      valueAttr = this.model.get('value-attribute'),
      format = this.model.get('format') || { type: 'number' },
      datePeriod = this.model.get('date-period') || 'quarter';

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
          period: this.formatPeriod(current, datePeriod)
        }
      );
    }

    if (previous && previous.get(valueAttr)) {
      _.extend(config, {
        previousPeriod: {
          period: this.formatPeriod(previous, datePeriod),
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
