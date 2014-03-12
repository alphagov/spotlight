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
    }
  };

});
