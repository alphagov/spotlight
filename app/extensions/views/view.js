define([
  'backbone',
  'extensions/mixins/date-functions',
  'extensions/mixins/formatters',
  'modernizr',
  'jquery',
  'lodash'
],
function (Backbone, DateFunctions, Formatters, Modernizr, $, _) {
  var View = Backbone.View.extend({

    modernizr: Modernizr,

    initialize: function (options) {
      options = options || {};
      this.viewInstances = {};
      Backbone.View.prototype.initialize.apply(this, arguments);
      var el = options.el;
      delete options.el;
      _.extend(this, options);
      options.el = el;
    },

    render: function (options) {
      options = options || {};
      this.removeSubviews(options);
      if (this.template) {
        var context = _.extend(
          this.templateContext(), options.context
        );
        this.$el.html(this.template(context));
      }
      this.renderSubviews(options);
    },

    templateContext: function () {
      var context = {
        model: this.model,
        collection: this.collection
      };
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

    removeSubviews: function () {
      _.invoke(this.viewInstances, 'remove');
      this.viewInstances = {};
    },

    renderSubviews: function () {

      var viewsDefinition = this.views;
      if (_.isFunction(viewsDefinition)) {
        viewsDefinition = viewsDefinition.call(this);
      }
      var instances = this.viewInstances;
      _.each(viewsDefinition, function (definition, selector) {
        var $el = this.$el.find(selector);
        if (!$el.length) {
          console.warn('No element found for ' + selector);
          return;
        }

        var View,
            options = this.defaultSubviewOptions();

        $el.empty();
        options.$el = $el;

        if (typeof definition === 'function') {
          View = definition.call(this);
        } else if (_.isObject(definition)) {
          View = definition.view;
          if (_.isFunction(definition.options)) {
            _.extend(options, definition.options.call(this));
          } else {
            _.extend(options, definition.options);
          }
        } else {
          console.warn('Invalid view definition for ' + selector);
          return;
        }

        var instance = instances[selector] = new View(options);
        instance.render({
          context: this.templateContext()
        });
      }, this);
    },

    /*
     *  Subviews definition. Override in subclasses.
     *
     *  Syntax:
     *  views: {
     *      '.selector1': SubView,
     *      // default, provides subview with result of this.defaultSubviewOptions()
     *
     *      '#selector2': {
     *        view: AnotherView,
     *        options: {
     *          // overrides to this.defaultSubviewOptions
     *          model: this.collection.selectedItem,
     *          customOption: 'foo'
     *        }
     *      },
     *      '.selector3': {
     *        view: YetAnotherView,
     *        options: function () {
     *          // `this` refers to parent view
     *          return {
     *            // overrides to this.defaultSubviewOptions
     *            model: this.collection.selectedItem,
     *            customOption: 'foo'
     *          }
     *        }
     *      }
     *  },
     *
     *  N.B.: Selectors need to refer to elements created by the parent view.
     *  No wrapper element is created for subviews.
     */
    views: {},

    keys: {
      escape: 27
    },

    currencies: {
      gbp: { prefix: '£', suffix: '' }
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
    numberListFormatter: function (values, currency) {
      var currencyEntry = (currency) ? this.currencies[currency] : null;
      return function (value) {
        return this.formatNumericLabel(value, currencyEntry);
      }.bind(this);
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
     * formatNumericLabel(1234567890) -> 1.23b
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
    formatNumericLabel: function (value, currency) {
      var props = {
        type: 'number',
        magnitude: true,
        pad: true
      };
      if (currency) {
        props.type = 'currency';
        props.symbol = currency.symbol;
      }
      return this.format(value, props);
    },

    formatPercentage: function (fraction, numDecimals, showSigns) {
      var value = this.format(fraction, {
        type: 'percent',
        dps: numDecimals,
        fixed: numDecimals
      });
      if (showSigns) {
        if (fraction > 0) {
          value = '+' + value;
        } else if (fraction < 0) {
          // replace hyphens with unicode minus symbol
          value = value.replace('-', '−');
        }
      }
      return value;
    },

    formatPeriod: function (model, period) {
      var start = model.get('_start_at') || model.get('start_at');
      var end = model.get('_end_at') || model.get('end_at');

      if (model.get('_original_start_at')) {
        start = this.getMoment(model.get('_original_start_at'));
        end = this.getMoment(model.get('_original_end_at'));
      }

      if (start) {
        start = this.getMoment(start);
      }
      if (end) {
        end = this.getMoment(end);
      }

      switch (period) {
        case 'week': // fall through; we're formatting weeks same as days
        case 'day':
          if (end) {
            end = end.subtract(1, 'days');
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
        case 'quarter':
          if (end) {
            end = end.subtract(1, 'months');
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

    /**
     * Formats a number of milliseconds as a given unit of time
     * @param {Number} milliseconds Duration in milliseconds
     * @param {String} unit Unit to format as (either ms or s)
     * @param {Number} precision Number of significant figures to format to
     */
    formatDuration: function (milliseconds, unit, precision) {

      var formattedNumber, formatString;

      var millisecondsToSeconds = function (t) {
        return t / 1000;
      };

      milliseconds = Math.round(milliseconds);

      if (unit === 's') {
        formattedNumber = View.prototype.numberToSignificantFigures(millisecondsToSeconds(milliseconds), precision);
        formatString = 's';
      } else {
        formattedNumber = View.prototype.numberToSignificantFigures(milliseconds, precision);
        formatString = 'ms';
      }

      return formattedNumber + formatString;

    },

    /**
     * Rounds a number to a given number of significant figures
     * @param {Number} value Number to round
     * @param {Number} sigFigs Number of significant figures to round to
     */
    numberToSignificantFigures: function (value, sigFigs) {
      if (value === 0) {
        return 0;
      } else {
        var exponent = sigFigs - Math.floor(Math.log(Math.abs(value)) / Math.LN10) - 1;
        var magnitude = Math.pow(10, exponent);
        return Math.round(value * magnitude) / magnitude;
      }
    },

    /**
     * Convenience method, gets object property or method result. The method
     * is passed no arguments and is executed in the object context.
     * @param {String} prop Name of object property or method.
     * @param {Object} [obj=this] Object to inspect.
     */
    prop: function (prop, obj) {
      obj = obj || this;
      return _.isFunction(obj[prop]) ? obj[prop].call(obj) : obj[prop];
    }
  });

  _.extend(View.prototype, DateFunctions);
  _.extend(View.prototype, Formatters);

  return View;
});
