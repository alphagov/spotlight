define([
  'moment-timezone'
], function (moment) {
  var formatters = {

    time: function (value, options) {
      _.defaults(options, {
        format: 'hh:mma'
      });
      return formatters.date(value, options);
    },

    date: function (value, options) {
      _.defaults(options, {
        format: 'D MMMM YYYY'
      });
      var date = moment(value);
      return date.format(options.format);
    },

    duration: function (value, options) {
      _.defaults(options, {
        unit: 'ms',
        dps: 0
      });

      var divisor = 1;
      if (options.unit === 's') {
        divisor = 1000;
      } else if (options.unit === 'm') {
        divisor = 60000;
      }
      return formatters.number(value / divisor) + options.unit;
    },

    currency: function (value, options) {
      _.defaults(options, {
        symbol: '£',
        dps: 0
      });
      return options.symbol + formatters.number(value, options);
    },

    percent: function (value, options) {
      _.defaults(options, {
        dps: 0
      });
      return formatters.number(value * 100, options) + '%';
    },

    integer: function (value, options) {
      _.defaults(options, {
        dps: 0
      });
      return formatters.number(value, options);
    },

    number: function (value, options) {
      _.defaults(options, {
        dps: 0,
        commas: true
      });
      if (!isNaN(Number(value))) {
        value = Number(value);
        if (typeof options.dps === 'number') {
          var magnitude = Math.pow(10, options.dps);
          value = Math.round(value * magnitude) / magnitude;
        }
        if (options.commas) {
          value = utils.commas(value);
        }
      }
      return value;
    }

  };

  var utils = {
    commas: function (value) {
      value = value.toString();
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(value))
        value = value.replace(pattern, '$1,$2');
      return value;
    }
  };

  return {
    format: function (value, formatter) {
      if (typeof formatter === 'string') {
        formatter = {
          type: formatter
        };
      }
      if (typeof formatters[formatter.type] === 'function' && value !== null && value !== undefined) {
        return formatters[formatter.type](value, formatter || {});
      } else {
        return value;
      }
    }
  };

});
