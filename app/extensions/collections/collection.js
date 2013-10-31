define([
  'backbone',
  'extensions/models/model',
  'extensions/models/query',
  'extensions/mixins/safesync',
  'common/date-range',
  'moment',
  'jquery'
],
function (Backbone, Model, Query, SafeSync, DateRange, moment, $) {

  // get base URL for Backdrop instance (with trailing slash if missing)
  var baseUrl = "http://localhost:3057/";
  if (baseUrl) {
    baseUrl = baseUrl.replace(/\/?$/, '/');
  }

  var Collection = Backbone.Collection.extend({

    moment: moment,

    model: Model,

    /**
     * Defines location of Backdrop service
     */
    baseUrl: baseUrl,

    defaultDateFormat: Model.prototype.defaultDateFormat,

    initialize: function (models, options) {
      this.options = options = options || {};

      _.each(['filterBy', 'collections', 'data-type', 'data-group'], function (prop) {
        if (options[prop]) {
          this[prop] = options[prop];
        }
      }, this);

      if (this.collections) {
        // does not request data itself but depends on other collections
        this.instantiateParts(models, options);
      }
      this.createQueryModel();

      Backbone.Collection.prototype.initialize.apply(this, arguments);
    },

    instantiateParts: function (models, options) {
      delete options.collections;
      this.collectionInstances = _.map(this.collections, function (classRef) {
        if (classRef.collection) {
          return new classRef.collection(
            models, _.extend({}, classRef.options, options)
          );
        } else {
          return new classRef(models, options);
        }
      });
    },

    createQueryModel: function () {
      var queryParams = _.extend({}, this.prop("defaultQueryParams"), this.prop("queryParams"));
      this.query = new Query(queryParams);
      this.query.on("change", function () { this.fetch(); }, this);
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
    },

    fetch: function (options) {
      options = _.extend({
        queryId: this.queryId
      }, options);

      if (this.collectionInstances) {
        this.fetchParts(options);
      } else {
        Backbone.Collection.prototype.fetch.call(this, options);
      }
    },

    /**
     * Fetches data for all constituent collections. Parses data when all
     * requests have returned successfully. Fails if any of the requests fail.
     */
    fetchParts: function (options) {
      options = options || {};

      _.each(this.collectionInstances, function (collection) {
        collection.query.set(this.query.attributes, {silent: true});
      }, this);

      var numRequests = this.collectionInstances.length;
      var openRequests = numRequests;
      var successfulRequests = 0;
      var that = this;

      var onResponse = function () {
        if (--openRequests > 0) {
          // wait for other requests to return
          return;
        }

        if (successfulRequests === numRequests) {
          // all constituent collections returned successfully
          that.reset.call(that, that.parse.call(that, options), { parse: true });
        }
      };
      var onSuccess = function () {
        successfulRequests++;
        onResponse();
      };

      _.each(this.collectionInstances, function (collection) {
        collection.on('error', function () {
          // escalate error status
          if (options.error) {
            options.error.apply(collection, arguments);
          }
          var args = ['error'].concat(Array.prototype.slice.call(arguments));
          this.trigger.apply(this, args);
        }, this);
        collection.fetch({
          success: onSuccess,
          error: onResponse
        });
      }, this);
    },

    defaultQueryParams: function () {
      var params = {};
      if (this.filterBy) {
        params.filter_by = _.map(this.filterBy, function(value, key) {
          return key + ':' + value;
        });

        if (params.filter_by.length === 1) {
          params.filter_by = params.filter_by[0];
        }
      }
      return params;
    },

    lastWeekDateRangeParams: DateRange.lastWeekDateRange,

    /**
     * Constructs a Backdrop query for the current environment
     */
    url: function() {
      // add query parameters
      var params = _.clone(this.query.attributes);

      // convert date parameters
      _.each(params, function (value, key) {
        if (this.moment.isMoment(value)) {
          params[key] = value.format(this.defaultDateFormat);
        }
      });

      return this.baseUrl + 'backdrop-stub/' + this['data-group'] + '/api/' + this['data-type'] +'?' + $.param(params, true);
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
        if (aVal == null && bVal == null) {
          // no point comparing two null values,
          // allow fallback to other comparator
          return null;
        }
        else if (bVal == null) {
          return -1;
        }
        else if (aVal == null) {
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
    selectItem: function(index, options) {
      if (index === this.selectedIndex) {
        return;
      }
      var model = (index == null) ? null : this.models[index];
      this.selectedItem = model;
      this.selectedIndex = index;
      if (!options || !options.silent) {
        this.trigger("change:selected", model, index);
      }
    },

    getCurrentSelection: function () {
      return {
        selectedModel: this.selectedItem,
        selectedModelIndex: this.selectedIndex
      };
    }
  });

    _.extend(Collection.prototype, SafeSync);

  return Collection;
});