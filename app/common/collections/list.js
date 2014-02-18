define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {
  var ListCollection = MatrixCollection.extend({

    queryParams: function () {
      return {
        sort_by: this.options.sortBy,
        limit: this.options.limit
      };
    },

    initialize: function (models, options) {
      MatrixCollection.prototype.initialize.apply(this, arguments);

      // this is delibrately not allowing empty strings
      // as this is an undesirable title or id
      if (!options || !options.title || !options.id) {
        throw new Error("Both 'title' and 'id' are required options for a ListCollection instance");
      }

      if (isClient && _.isNumber(this.options.updateInterval)) {
        clearInterval(this.timer);
        this.timer = setInterval(
          _.bind(this.fetch, this), this.options.updateInterval
        );
      }
    },

    parse: function (response) {

      var numberRegexp = /^[0-9\.]+$/,
          data;

      data = _.map(response.data, function(d) {
        return _.reduce(d, function(out, val, key) {
          if (numberRegexp.test(val)) {
            val = parseFloat(val);
          }
          out[key] = val;
          return out;
        }, {});
      });

      return {
        id: this.options.id,
        title: this.options.title,
        values: data
      };

    },

    fetch: function (options) {
      options = _.extend(this.options.fetchOptions || {}, options);
      MatrixCollection.prototype.fetch.call(this, options);
    }

  });

  return ListCollection;
});
