define([
  'common/collections/completion'
], function (CompletionCollection) {
  return CompletionCollection.extend({

    defaultValueAttrs: function (value) {
      var val = value[this.valueAttr];
      if (val === null && this.options.defaultValue !== undefined) {
        val = this.options.defaultValue;
      }
      return {
        uniqueEvents: val
      };
    },

    parse: function () {
      var data = CompletionCollection.prototype.parse.apply(this, arguments);
      return _.map(data, function (model) {
        return _.extend(model, this.defaultValueAttrs(model));
      }, this);
    }

  });
});
