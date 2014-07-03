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
          {},
          options.context,
          this.templateContext()
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
        var $el = this.$(selector);
        if (!$el.length) {
          console.warn('No element found for ' + selector);
          return;
        }

        var View,
            options = this.defaultSubviewOptions();

        options.el = $el;

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

    formatPeriod: function (model, period) {
      var start = model.get('_start_at') || model.get('start_at');
      var end = model.get('_end_at') || model.get('end_at');

      if (model.get('_original_start_at')) {
        start = this.getMoment(model.get('_original_start_at'));
        end = this.getMoment(model.get('_original_end_at'));
      }

      var formats = {
        hour: 'HH:mm',
        day: 'D MMM YYYY',
        week: 'D MMM YYYY',
        month: 'MMMM YYYY',
        quarter: 'MMM YYYY'
      };

      var options = {
        type: 'date',
        format: formats[period]
      };

      var input = start;

      if (end && (period === 'week' || period === 'quarter')) {
        options.type = 'dateRange';
        input = [start, end];
      }

      return this.format(input, options);
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
