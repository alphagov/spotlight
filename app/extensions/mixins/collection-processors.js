define(['backbone'], function (Backbone) {

  function ensureCollection(obj) {
    if (obj instanceof Backbone.Collection === false) {
      throw new Error('Collection processor factory methods must be called with a Collection as context');
    }
  }

  // methods are called with a model key as argument, and collection as `this`
  // should return a function which takes a value as a single argument
  return {
    percentOfTotal: function (key) {
      ensureCollection(this);
      var total = this.reduce(function (memo, model) {
        return memo + model.get(key);
      }, 0);
      return function (value) {
        return value / total;
      };
    },
    delta: function (key) {
      return _.bind(function (value, model) {
        if (!this.isXADate()) {
          var ret = null;
          var values = model.get('values');
          if (values.length > 1) {
            var previous = values[values.length - 2][key];
            if (previous) {
              ret = (value - previous) / previous;
            }
          }
          return ret;
        } else {
          // we may wish to implement this for time-keyed collections at some point, but it's not supported now
          console.warn('"delta" processor is not currently supported for date indexed collections');
          return value;
        }
      }, this);
    }
  };

});
