define([
    'backbone',
    'moment',
    'modernizr',
    'jquery',
    'underscore'
],
function (Backbone, moment, Modernizr, $, _) {
    var View = Backbone.View.extend({
      
      moment: moment,
      modernizr: Modernizr,
    
      initialize: function (options) {
        _.extend(this, options);
        this.viewInstances = {};
        Backbone.View.prototype.initialize.apply(this, arguments);
      },

      make: function(tagName, attributes, content) {
        if (isServer) {
          var el = $('<' + tagName + '>')[0];
          if (attributes) Backbone.$(el).attr(attributes);
          if (content != null) Backbone.$(el).html(content);
          return el;
        } else {
          return Backbone.View.prototype.make.apply(this, arguments);
        }
      },

      render: function (options) {
        options = options || {};
        if (this.template) {
          var context = _.extend(
            this.templateContext(), options.context
          );
          this.$el.html(this.template(context));
        }
        this.renderSubviews(options);
      },
      
      templateContext: function () {
        var context = {};
        if (this.model) {
          _.extend(context, this.model.toJSON());
        }
        return context;
      },

      defaultSubviewOptions: function () {
        return {
          renderOnInit: true,
          model: this.model,
          collection: this.collection
        };
      },

      renderSubviews: function (options) {
        
        var viewsDefinition = this.views;
        if (_.isFunction(viewsDefinition)) {
          viewsDefinition = viewsDefinition();
        }
        var instances = this.viewInstances;
        _.each(viewsDefinition, function (definition, selector) {
          var $el = this.$el.find(selector);
          if (!$el.length) {
            console.warn('No element found for ' + selector);
            return;
          }
          
          var view,
              options = this.defaultSubviewOptions();

          $el.empty();
          options.$el = $el;
          
          if (typeof definition === 'function') {
            view = definition.call(this);
          } else if (_.isObject(definition)) {
            view = definition.view;
            if (_.isFunction(definition.options)) {
              _.extend(options, definition.options.call(this));
            } else {
              _.extend(options, definition.options);
            }
          } else {
            console.warn('Invalid view definition for ' + selector);
            return;
          }

          var instance = instances[selector] = new view(options);
          instance.render({
            context: this.templateContext()
          });
        }, this);
      },
      
      views: {},
      
      keys: {
        escape: 27
      },
      
      magnitudes: {
          million:  {value: 1e6, threshold: 499500, suffix:"m"},
          thousand: {value: 1e3, threshold: 499.5,  suffix:"k"},
          unit:     {value: 1,   threshold: 0,      suffix:""}
      },

      magnitudeFor: function (value) {
          if (value >= 1e6) return this.magnitudes.million;
          if (value >= 1e3) return this.magnitudes.thousand;
          return this.magnitudes.unit;
      },

      format: function (value, magnitude, decimalPlaces) {
          return (value / magnitude.value).toFixed(decimalPlaces || 0).toString() + magnitude.suffix;
      },

      /**
       * Returns a number formatting function whose actual format depends on the values passed as argument.
       * The formatter can then be used to format all the number in the series applying the same format, regardless of the
       * individual values. This is especially useful for graph axes, where a homogeneous formatting of the labels is
       * required.
       *
       * @param values
       * @return {Function}
       */
      numberListFormatter: function (values) {
        function isAnExactMultipleOf(magnitude) {
          return function(n) { return n % magnitude === 0; };
        }

        var max = values.reduce(function(a,b) {return a > b ? a : b;});
        var magnitude = this.magnitudeFor(max);
        var decimalPlaces;
        if (max === magnitude.value) {
          decimalPlaces = 1;
        } else {
          decimalPlaces = values.every(isAnExactMultipleOf(magnitude.value))? 0 : 1;
        }
        
        var format = this.format;
        return function(value) {
          if (value === 0) return "0";
          return format(value, magnitude, decimalPlaces);
        };
      },

      /**
       * Returns an object describing evenly spaced, nice tick values given an extent and a minimum tick count.
       * The returned object will include the values, extent and step of the ticks.
       * The extent may be extended to include the next nice tick value.
       *
       * @param extent
       * @param minimumTickCount
       * @return {Object}
       */
      calculateLinearTicks: function(extent, minimumTickCount) {
        if (extent[0] >= extent[1]) {
          throw new Error("Upper bound must be larger than lower.");
        }
        var targetTickCount = minimumTickCount - 1,
            span = extent[1] - extent[0],
            step = Math.pow(10, Math.floor(Math.log(span / targetTickCount) / Math.LN10)),
            err = targetTickCount / span * step;

        // Filter ticks to get closer to the desired count.
        if (err <= 0.15) step *= 10;
        else if (err <= 0.35) step *= 5;
        else if (err <= 0.75) step *= 2;

        // Round start and stop values to step interval.
        var first = Math.floor(extent[0] / step) * step,
            last = Math.ceil(extent[1] / step) * step,
            lastInclusive = last + step / 2;

        return {
          values:_.range(first, lastInclusive, step) ,
          extent:[first, last],
          step:step
        };
      },

      /**
       * Format a number according to its magnitude.
       *
       * Numbers are rendered with a suffix indicating the magnitude
       * and with at least 3 total digits.
       *
       * Examples:
       *
       * formatNumericLabel(    123) -> 123
       * formatNumericLabel(   1234) -> 1.23k
       * formatNumericLabel(  12345) -> 12.3k
       * formatNumericLabel( 123456) -> 123k
       * formatNumericLabel(1234567) -> 1.23m
       *
       * This function is more complicated than one would think it need be for
       * two reasons:
       * - numbers in javascript are represented as IEEE 745 floating point, and
       *   therefore they have approximation issues that make unpredictable the
       *   rounding of limit numbers; this could be ignored, making the algorithm
       *   simpler, if that level of accuracy is not required
       * - numbers below 1000 show only meaningful decimal digits, while numbers
       *   above 1000 always show the decimal digits; ex: 1 -> 1; 1000 -> 1.00k
       *
       * If we can relax these two reasons, the algorithm can become much simpler.
       * See for example View.prototype.format for a simpler alternative.
       */
      formatNumericLabel: function(value) {
        if (value === null) return null;
        if (value === 0) return "0";

        /*
         * Return the appropriate magnitude (m, k, unit) for rounding a number.
         *
         * Thresholds are picked so that number are formatted with the closest
         * magnitude. So for example magnitudeOf(500,000) returns magnitudes.million,
         * and not magnitudes.thousand, so that it is formatted as 0.50m rather
         * than 500k. The actual threshold is 499,500, because digits after the
         * 3rd most significant are rounded; this means that 499,499 will be
         * rounded to 499,000 and formatted as 499k; 499,500 will be rounded
         * as 500,000 and formatted as 0.50m.
         */
        var magnitudeOf = function(number) {
          if (Math.abs(number) >= 499500) return View.prototype.magnitudes.million;
          if (Math.abs(number) >= 499.5) return View.prototype.magnitudes.thousand;
          return View.prototype.magnitudes.unit;
        };

        /*
         * Numbers less than  10 times the magnitude -> 2 decimal digits: N.NNx
         * Numbers less than 100 times the magnitude -> 1 decimal digits: NN.Nx
         * Numbers 100 times the magnitude or more   -> no decimal digits: NNNx
         */
        var decimalDigits = function(number, magnitude) {
          if (Math.abs(number) < magnitude.value * 10) return 2;
          if (Math.abs(number) < magnitude.value * 100) return 1;
          return 0;
        };

        var magnitude = magnitudeOf(value);
        var digits = decimalDigits(value, magnitude);
        var roundingFactor = Math.pow(10, digits);

        var roundedValue = Math.round(value * roundingFactor / magnitude.value) / roundingFactor;

        if (magnitude === View.prototype.magnitudes.unit) {
          // Render only significant decimal digits: 1.5 -> 1.5
          // NOTE: Why are we formatting decimal digits differently for numbers below 1000?
          return roundedValue.toString() + magnitude.suffix;
        }
        // Render a fixed number of decimal digits: 1,500 -> 1.50k
        return roundedValue.toFixed(digits) + magnitude.suffix;
      },

      formatPercentage: function (fraction, numDecimals) {
        if (isNaN(fraction) || !_.isNumber(fraction)) {
          return fraction;
        }
        numDecimals = numDecimals || 0;
        return (100 * fraction).toFixed(numDecimals) + '%';
      },

      formatPeriod: function (model, period) {
        var start = model.get('_start_at') || model.get('start_at');
        var end = model.get('_end_at') || model.get('end_at');

        switch (period) {
          case 'week': // fall through; we're formatting weeks same as days
          case 'day':
            if (end) {
              end = moment(end).subtract(1, 'days');
              if (start.diff(end)) {
                if (start.month() !== end.month()) {
                  return start.format('D MMM') + ' to ' + end.format('D MMM YYYY');
                } else {
                  return start.format('D') + ' to ' + end.format('D MMM YYYY');
                }
              }
            }
            return start.format('D MMM YYYY');
          case 'month':
            if (end) {
              end = moment(end).subtract(1, 'months');
              if (start.diff(end)) {
                if (start.year() !== end.year()) {
                  return start.format('MMM YYYY') + ' to ' + end.format('MMM YYYY');
                } else if (start.month() !== end.month()) {
                  return start.format('MMM') + ' to ' + end.format('MMM YYYY');
                }
              }
            }
            return start.format('MMMM YYYY');
        }
      },

      pluralise: function (singular, quantity, plural) {
        if (quantity === 1) {
          return singular;
        } else if (plural) {
          return plural;
        } else {
          return singular + 's';
        }
      },

      formatDuration: function (milliseconds, maxLength) {

        var millisecondsToSeconds = function (t) {
          return t/1000;
        };

        var roundWithPrecision = function (x,p) {
          var a = [1,10,100,1000,10000,100000,1000000,10000000,100000000,1000000000,10000000000];
          return Math.round(x*a[p])/a[p];
        };

        var visualLength = function (item) {
          return item.toString().length;
        };

        milliseconds = Math.round(milliseconds);

        if(visualLength(milliseconds) > maxLength){
          var seconds = millisecondsToSeconds(milliseconds);
          var secondsWithPrecision = roundWithPrecision(seconds, 1);
          if(visualLength(secondsWithPrecision) > maxLength){
            return Math.round(seconds) + 's';        
          }
          else{
            return secondsWithPrecision + 's';
          }
        }
        else{
          return milliseconds + 'ms';
        }

      },
    
      /**
       * Convenience method, gets object property or method result. The method
       * is passed no arguments and is executed in the object context.
       * @param {String} prop Name of object property or method.
       * @param {Object} [obj=this] Object to inspect.
       */
      prop: function(prop, obj) {
        obj = obj || this;
        return _.isFunction(obj[prop]) ? obj[prop].call(obj) : obj[prop];
      }
    });

    return View;
});
