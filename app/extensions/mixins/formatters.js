// Please note that this is no longer the canonical source for Performance Platform formatters.
// Formatters have been extracted to the client:
//   https://github.com/alphagov/performanceplatform-client.js/blob/master/lib/utils/formatter.js
// Bug fixes should be made there - this file is deprecated and will be removed in the future.
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
      if (_.isArray(value)) {
        return dateRangeFormatter(value, options);
      }
      var date = moment(value).local();
      var val;
      if (options.calendar) {
        val = date.calendar();
      } else {
        val = date.format(options.format);
      }
      return val;
    },

    duration: function (value, options) {
      _.defaults(options, {
        unit: 'ms',
        pad: true
      });

      if (value instanceof Date) {
        value = value.getTime();
      }
      var divisor = 1;
      var result;
      if (options.unit === 'm') {
        divisor = 60000;
        result = Math.floor(value / divisor) + 'm';
        if (value % divisor) {
          result += ' ' + this.duration(value % divisor, { unit: 's', dps: 0 });
        }
      } else {
        if (options.unit === 's') {
          divisor = 1000;
        }
        result = formatters.number(value / divisor, options) + options.unit;
      }

      return result;
    },

    currency: function (value, options) {
      _.defaults(options, {
        symbol: '£',
        pence: value < 10
      });
      if (options.pence) {
        options.dps = options.fixed = 2;
      } else {
        value = Math.round(value);
      }
      if (value === 0) {
        return options.symbol + '0';
      } else {
        return options.symbol + formatters.number(value, options);
      }
    },

    percent: function (value, options) {
      if (isNaN(Number(value))) {
        return value;
      }
      _.defaults(options, {
        dps: 1,
        normalisation: 1.0
      });
      value = value * 100 / options.normalisation;
      if (value === 0 || value === 100) {
        options.dps = 0;
      }
      var output = formatters.number(value, options) + '%';
      if (options.showSigns) {
        if (value > 0) {
          output = '+' + output;
        } else if (value < 0) {
          // replace hyphens with unicode minus symbol
          output = output.replace('-', '−');
        }
      }
      return output;
    },

    integer: function (value, options) {
      return formatters.number(Math.round(value), options);
    },

    number: function (value, options) {
      var defaults = {
        commas: true,
        sigfigs: 3
      };

      _.defaults(options, defaults);

      var suffix, minus;

      if (!isNaN(Number(value))) {
        value = Number(value);
        if (value < 0) {
          value = Math.abs(value);
          minus = true;
        }
        if (options.magnitude) {
          var magnitude;
          if (_.isObject(options.magnitude)) {
            magnitude = options.magnitude;
          } else {
            magnitude = utils.magnitude(value);
          }
          suffix = magnitude.suffix;
          value = value / magnitude.value;
        }
        if (typeof options.sigfigs === 'number' && typeof options.dps === 'undefined') {
          options.dps = Math.min(Math.max(Math.ceil(options.sigfigs - 1 - utils.log10(value)), 0), options.sigfigs - 1);
        }
        if (typeof options.dps === 'number') {
          value = utils.roundToDps(value, options.dps);
        }
        if (value === 0) {
          return '0';
        }
        if ((suffix || !options.magnitude) && options.pad && options.dps > 0) {
          options.fixed = options.dps;
        }
        if (typeof options.fixed === 'number') {
          value = utils.pad(value, options.fixed);
        }
        if (options.commas) {
          value = utils.commas(value);
        }
        if (suffix) {
          value = value + suffix;
        }
        if (minus && value !== '0') {
          value = '-' + value;
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
    },

    plural: function (value, options) {
      if (typeof options.singular === 'undefined') {
        throw new Error('singular option must be defined for plural formatter');
      }
      if (value === 1) {
        return options.singular;
      } else if (options.plural) {
        return options.plural;
      } else {
        return options.singular + 's';
      }
    },

    url: function (value) {
      if (value.length === 0) {
        return '';
      }
      return '<a href="' + value + '">' + value.replace(/&/g, '&amp;') + '</a>';
    }
  };

  var utils = {

    log10: function (value) {
      return Math.log(Math.abs(value)) / Math.LN10;
    },

    commas: function (value) {
      value = value.toString().split('.');
      var pattern = /(-?\d+)(\d{3})/;
      while (pattern.test(value[0])) {
        value[0] = value[0].replace(pattern, '$1,$2');
      }
      return value.join('.');
    },

    roundToDps: function (value, dps) {
      var magnitude = Math.pow(10, dps);
      return Math.round(value * magnitude) / magnitude;
    },

    magnitude: function (value) {
      var magnitudes = {
        thousand: {value: 1e3, suffix: 'k', limit: 1e4 },
        million:  {value: 1e6, suffix: 'm' },
        billion:  {value: 1e9, suffix: 'bn' }
      };
      var ret = {
        suffix: '',
        value: 1
      };
      _.each(magnitudes, function (mag) {
        if (value >= (mag.limit || mag.value) * 0.9995) {
          ret = mag;
        }
      });
      return ret;
    },

    pad: function (value, places, str) {
      value = value + '';
      str = str || '0';
      var pieces = value.split('.');
      if (places === 0) {
        return pieces[0];
      } else {
        if (pieces.length === 1) {
          pieces.push('');
        }
        while (pieces[1].length < places) {
          pieces[1] += str;
        }
        return pieces.join('.');
      }
    }
  };

  var format = function (value, formatter) {
    if (typeof formatter === 'string') {
      formatter = {
        type: formatter
      };
    }
    formatter = formatter || {};
    if (typeof formatters[formatter.type] === 'function' && value !== null && value !== undefined) {
      var val = formatters[formatter.type](value, _.clone(formatter));
      if (formatter.abbr && formatter.magnitude) {
        var unmagnituded = formatters[formatter.type](value, _.extend({}, formatter, { magnitude: false, pad: false }));
        if (val !== unmagnituded) {
          return '<abbr title="' + unmagnituded + '">' + val + '</abbr>';
        }
      }
      return val;
    } else {
      return value;
    }
  };

  var numberListFormatter = function (values, currency) {

    var max = Math.max.apply(Math, values);
    var magnitude = utils.magnitude(max);
    var props = {
      type: 'number',
      pad: true
    };
    if (currency) {
      props.type = 'currency';
    }
    if (magnitude.value === 1) {
      magnitude = true;
    }
    if (_.all(values, function (v) { return v % magnitude.value === 0; })) {
      props.dps = 0;
    } else if (_.all(values, function (v) { return v % (magnitude.value / 10) === 0; })) {
      props.dps = 1;
    }
    props.magnitude = magnitude;
    return _.bind(function (value) {
      return this.format(value, _.clone(props));
    }, this);

  };

  var dateRangeFormatter = function(value, options) {
    _.defaults(options, {
      format: 'D MMM YYYY',
      subtract: 'day'
    });
    // avoid overlapping at the ends of a range i.e. 1 Mar-1 Apr => 1 Mar-31 Mar
    if (options.subtract) {
      value[1] = moment(value[1]).subtract(1, options.subtract);
    }

    var start = formatters.date(value[0], options);
    var end = formatters.date(value[1], options);

    if (start === end) {
      return end;
    } else {
      var startOptions = _.clone(options);
      // need to prevent stripping formats like DD/MM/YYYY etc
      if (options.format.match(/^[DMY ]+$/)) {
        var y1 = formatters.date(value[0], _.extend({}, options, { format: 'YYYY' }));
        var y2 = formatters.date(value[1], _.extend({}, options, { format: 'YYYY' }));
        if (y1 === y2) {
          startOptions.format = startOptions.format.replace(/[Y]+ ?/, '');
        }
        var m1 = formatters.date(value[0], _.extend({}, options, { format: 'MMM YYYY' }));
        var m2 = formatters.date(value[1], _.extend({}, options, { format: 'MMM YYYY' }));
        if (m1 === m2) {
          startOptions.format = startOptions.format.replace(/[M]+ ?/, '');
        }
        startOptions.format = startOptions.format.trim();
      }
      return formatters.date(value[0], startOptions) + ' to ' +
        end;
    }
  };

  return {
    format: format,
    numberListFormatter: numberListFormatter
  };

});
