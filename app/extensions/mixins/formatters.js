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
      options.dps = options.fixed = (options.pence ? 2 : 0);
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
        if (options.fixed && typeof options.fixed === 'number') {
          value = value.toFixed(options.fixed);
        }
        if (options.commas) {
          value = utils.commas(value);
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
