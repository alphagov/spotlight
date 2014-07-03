define([
  'backbone',
  'extensions/mixins/safesync',
  'extensions/mixins/date-functions',
  'extensions/mixins/collection-processors',
  'extensions/models/model',
  'extensions/models/data_source'
],
function (Backbone, SafeSync, DateFunctions, Processors, Model, DataSource) {

  var Collection = Backbone.Collection.extend({

    model: Model,

    defaultDateFormat: Model.prototype.defaultDateFormat,

    initialize: function (models, options) {
      options = options || {};
      this.options = options;

      if (!this.valueAttr) this.valueAttr = options.valueAttr;

      this.dataSource = new DataSource(options.dataSource);
      this.dataSource.on('change', function () {
        this.fetch();
      }, this);

      Backbone.Collection.prototype.initialize.apply(this, arguments);
    },

    getPeriod: function() {
      var queryParams = this.dataSource.get('query-params');
      return queryParams ? queryParams.period : undefined;
    },

    parse: function (response) {
      var data = response.data;
      var suffix = /:(sum|mean)/;
      var datetime = /_at$/;

      data = this.flatten(data);
      if (data.length) {
        _.each(_.keys(data[0]), function (key) {
          // remove suffixes from `collect`ed keys
          if (key.match(suffix)) {
            _.each(data, function (d) {
              d[key.replace(suffix, '')] = d[key];
            });
          }
          // cast all datetime strings to moment
          if (key.match(datetime) || key === '_timestamp') {
            _.each(data, function (d) {
              d[key] = this.getMoment(d[key]);
            }, this);
          }
        }, this);
        // fill in timestamps and valueAttrs where not defined
        _.each(data, function (d) {
          // this is for tx bar charts that do not provide a _start_at
          if (!d._start_at && this.options.axisPeriod) {
            d._start_at = d['_' + this.options.axisPeriod + '_start_at'];
          }
          // also to smooth out tx data
          if (!d._end_at && d.end_at) {
            d._end_at = d.end_at;
          }
          if (!d._timestamp) {
            d._timestamp = d._start_at;
          }
          if (this.valueAttr && d[this.valueAttr] === undefined) {
            d[this.valueAttr] = null;
          }
        }, this);
      }
      return data;
    },

    flatten: function (data) {
      var category = this.dataSource.groupedBy();
      if (category && data.length) {
        // if we have a grouped response, flatten the data
        if (data[0].values) {
          _.each(this.getYAxes(), function (axis) {
            if (axis.groupId !== 'total') {
              var dataset = _.find(data, function (d) {
                return d[category] === axis.groupId;
              });
              if (dataset) {
                this.mergeDataset(dataset, data[0], axis);
              }
            }
          }, this);
          data = data[0].values;
        }
      }
      return data;
    },

    mergeDataset: function (source, target, axis) {
      var valueAttr = this.valueAttr;
      _.each(source.values, function (model, i) {
        target.values[i][axis.groupId + ':' + valueAttr] = model[valueAttr];
      }, this);
    },

    getYAxes: function () {
      return _.clone(this.options.axes.y) || [];
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
      options = options || {};
      if (index === this.selectedIndex && !options.force) {
        return;
      }
      var model = (index === null) ? null : this.models[index];
      this.selectedIndex = index;
      this.selectedItem = model;
      if (!options.silent) {
        this.trigger('change:selected', model, index, options);
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

    trim: function (values, min) {
      var minlength = (typeof min === 'number') ? min : 0;
      while (values.length > minlength && values[0][this.options.valueAttr] === null) {
        values.shift();
      }
    },

    max: function (attr) {
      var maxModel = Backbone.Collection.prototype.max.call(this, function (model) {
        return model.get(attr);
      });
      if (maxModel instanceof Backbone.Model) {
        return maxModel.get(attr);
      }
    },

    min: function (attr) {
      var minModel = Backbone.Collection.prototype.min.call(this, function (model) {
        return model.get(attr);
      });
      if (minModel instanceof Backbone.Model) {
        return minModel.get(attr);
      }
    },

    hasData: function () {
      return this.length > 0;
    },

    mean: function (attr) {
      var total = this.total(attr);
      var count = this.defined(attr).length;
      return count === 0 ? null : total / count;
    },

    total: function (attr) {
      var total = this.reduce(function (sum, model) {
        var val = model.get(attr);
        if (val !== null && !isNaN(Number(val))) {
          sum += Number(val);
        }
        return sum;
      }, null);
      return total;
    },

    defined: function (attr) {
      return this.filter(function (model) {
        var val = model.get(attr);
        return val !== null && !isNaN(Number(val));
      });
    },

    processors: Processors

  });

  _.extend(Collection.prototype, SafeSync, DateFunctions);

  return Collection;
});
