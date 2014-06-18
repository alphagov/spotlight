define([
  'backbone',
  'extensions/mixins/safesync',
  'extensions/mixins/date-functions',
  'extensions/mixins/collection-processors',
  'extensions/models/model',
  'extensions/models/data_source',
],
function (Backbone, SafeSync, DateFunctions, Processors, Model, DataSource) {

  var Collection = Backbone.Collection.extend({

    model: Model,

    defaultDateFormat: Model.prototype.defaultDateFormat,

    initialize: function (models, options) {
      options = options || {};
      this.options = options;

      this.dataSource = new DataSource(options.dataSource);
      this.dataSource.on('change', this.fetch.bind(this, {}));

      Backbone.Collection.prototype.initialize.apply(this, arguments);
    },

    getPeriod: function() {
      var params = this.dataSource.get('query-params');
      return params && params['period'];
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
    },

    /**
     * Constructs a Backdrop query for the current environment
     */
    url: function () {
      return this.dataSource.buildUrl(this.prop('queryParams'));
    },

    /**
     * Sets a new attribute-specific comparator to sort by and then re-sorts.
     * This will trigger a reset event.
     * Uses custom comparator if one is defined for attribute,
     * otherwise uses default comparator.
     * @param {String} attr attribute to sort by
     * @param {Boolean} [descending=false] Sort descending when true, ascending when false
     * @param {Object} [options={}] Sort options
     */
    sortByAttr: function (attr, descending, options) {
      var comparators = this.prop('comparators');
      if (comparators && comparators[attr]) {
        // use custom comparator
        this.comparator = comparators[attr].call(this, attr, descending);
      } else {
        this.comparator = this.defaultComparator.call(this, attr, descending);
      }
      this.sortDescending = Boolean(descending);
      this.sortAttr = attr;
      this.sort(options);
    },

    /**
     * Returns a general purpose comparator function that will sort collection
     * by an attribute. Sorts numbers or strings alphabetically.
     * @param {String} attr attribute to sort by
     * @param {Boolean} [descending=false] Sort descending when true, ascending when false
     * @returns {Function} Function that can be used as collection comparator
     */
    defaultComparator: function (attr, descending) {
      return function (a, b) {
        var aVal = a.get(attr);
        var bVal = b.get(attr);

        var res = 0;

        // special cases - nulls are always lower than an actual value
        if (aVal === null && bVal === null) {
          // no point comparing two null values,
          // allow fallback to other comparator
          return null;
        }
        else if (bVal === null) {
          return -1;
        }
        else if (aVal === null) {
          return 1;
        }

        // normal sort behaviour, sorts by numbers or alphabetically
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
        }
        if (typeof bVal === 'string') {
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) {
          res = -1;
        } else if (aVal > bVal) {
          res = 1;
        }
        if (descending) {
          res *= -1;
        }
        return res;
      };
    },

    /**
     * Chooses an item in the collection as `selected` and notifies listeners.
     * @param {Number} index Index of item to select, or `null` to unselect
     * @param {Object} [options={}] Options
     * @param {Boolean} [options.silent=false] Suppress `change:selected` event
     */
    selectItem: function (index, options) {
      if (index === this.selectedIndex) {
        return;
      }
      var model = (index === null) ? null : this.models[index];
      this.selectedItem = model;
      this.selectedIndex = index;
      if (!options || !options.silent) {
        this.trigger('change:selected', model, index);
      }
    },

    getCurrentSelection: function () {
      return {
        selectedModel: this.selectedItem,
        selectedModelIndex: this.selectedIndex
      };
    },

    getTableRows: function (keys) {
      this.applyProcessors(keys);
      return this.map(function (model) {
        return _.map(keys, function (key) {
          var value;
          if (_.isArray(key)) {
            value = _.map(key, model.get.bind(model));
          } else {
            value = model.get(key);
          }
          return value;
        });
      });
    },

    applyProcessors: function (keys) {
      keys = _.flatten(keys);
      var processors = this.getProcessors(keys);
      _.each(processors, function (processor) {
        if (_.isFunction(this.processors[processor.fn])) {
          var fn = this.processors[processor.fn].call(this, processor.key);
          if (_.isFunction(fn)) {
            this.each(function (model) {
              var value = fn.call(this, model.get(processor.key));
              model.set(processor.fn + '(' + processor.key + ')', value);
            }, this);
          } else {
            throw new Error('collection processor did not return a function');
          }
        }
      }, this);
    },

    getProcessors: function (keys) {
      var processors = [];
      _.each(keys, function (key) {
        var match = key.match(/(\w+)\((.+)\)/);
        if (match && !_.any(this.pluck(key))) {
          processors.push({
            fn: match[1],
            key: match[2]
          });
        }
      }, this);
      return processors;
    },

    parse: function (response) {
      return response.data;
    },

    trim: function (values, min) {
      var minlength = (typeof min === 'number') ? min : 0;
      while (values.length > minlength && values[0][this.options.valueAttr] === null) {
        values.shift();
      }
    },

    processors: Processors

  });

  _.extend(Collection.prototype, SafeSync, DateFunctions);

  return Collection;
});
