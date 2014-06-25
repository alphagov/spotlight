define([
  'extensions/collections/collection'
],
function (Collection) {
  return Collection.extend({

    initialize: function (models, options) {
      // this is delibrately not allowing empty strings
      // as this is an undesirable title or id
      if (!options || !options.title || !options.id) {
        throw new Error('Both "title" and "id" are required options for a ListCollection instance');
      }
      Collection.prototype.initialize.apply(this, arguments);
    },

    parse: function (response) {

      var numberRegexp = /^[0-9\.]+$/,
          data;

      data = _.map(response.data, function (d) {
        return _.reduce(d, function (out, val, key) {
          if (numberRegexp.test(val)) {
            val = parseFloat(val);
          }
          out[key] = val;
          return out;
        }, {});
      });

      return data;

    }

  });
});
