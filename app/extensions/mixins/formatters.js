define([
  'moment-timezone'
], function (moment) {
  var formatters = {

    time: function (value, options) {
      _.defaults(options, {
        format: 'h:mma'
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

    dateRange: function (value, options) {
      _.defaults(options, {
        format: 'D MMM YYYY',
        subtract: 'day'
      });
      // avoid overlapping at the ends of a range i.e. 1 Mar-1 Apr => 1 Mar-31 Mar
      if (options.subtract) {
        value[1] = moment(value[1]).subtract(options.subtract, 1);
      }
      return formatters.date(value[0], options) + ' to ' +
        formatters.date(value[1], options);
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
      return formatters.number(value / divisor, options) + options.unit;
    },

    currency: function (value, options) {
      _.defaults(options, {
        symbol: '£',
        pence: false
      });
      if (options.pence) {
        options.dps = options.fixed = (options.pence ? 2 : 0);
      }
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
      var suffix;
      if (!isNaN(Number(value))) {
        value = Number(value);
        if (options.magnitude) {
          var parsed = utils.magnitude(value);
          suffix = parsed.suffix;
          value = parsed.value;
        }
        if (typeof options.dps === 'number' && typeof options.sigfigs !== 'number') {
          var magnitude = Math.pow(10, options.dps);
          value = Math.round(value * magnitude) / magnitude;
        } else if (typeof options.sigfigs === 'number') {
          var divisor = Math.pow(10, Math.ceil(Math.log(value) / Math.LN10) - options.sigfigs);
          value = Math.round(value / divisor) / (1 / divisor); // floating point wtf
        }
        if (options.fixed && typeof options.fixed === 'number') {
          value = value.toFixed(options.fixed);
        }
        if (options.commas) {
          value = utils.commas(value);
        }
        if (suffix) {
          value = value + suffix;
        }
      }
      return value.toString();
    },

    sentence: function (value, options) {
      _.defaults(options, {
        separator: /-/g,
        uppercase: []
      });

      // break into words
      value = value.replace(options.separator, ' ');
      // uppercase thing that should always be uppercase
      options.uppercase.push('i');
      var ucregex = new RegExp('\\b(' + options.uppercase.join('|') + ')\\b', 'g');
      value = value.replace(ucregex, function (s) {
        return s.toUpperCase();
      });
      // look for questions
      if (value.match(/^(can|how|what|why|where|who|when|is)\b/)) {
        value = value + '?';
      }
      // uppercase first letter
      value = value.charAt(0).toUpperCase() + value.slice(1);
      return value;
    }

  };

  var utils = {
    commas: function (value) {
      value = value.toString().split('.');
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(value[0]))
        value[0] = value[0].replace(pattern, '$1,$2');
      return value.join('.');
    },

    magnitude: function (value) {
      var magnitudes = {
        thousand: {value: 1e3, suffix: 'k' },
        million:  {value: 1e6, suffix: 'm' },
        billion:  {value: 1e9, suffix: 'b' }
      };
      var suffix, parsed = value;
      _.each(magnitudes, function (mag) {
        if (value > mag.value) {
          suffix = mag.suffix;
          parsed = value / mag.value;
        }
      });
      return {
        value: parsed,
        suffix: suffix
      };
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
