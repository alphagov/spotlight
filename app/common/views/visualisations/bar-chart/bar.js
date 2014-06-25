define([
  'extensions/views/graph/interleavedbar'
],
function (InterleavedBar) {
  var JourneyBar = InterleavedBar.extend({
    interactive: true,
    strokeAlign: 'inner',

    text: function (model) {
      var value = model.get(this.graph.valueAttr);
      if (_.isNull(value) || _.isUndefined(value) || _.isNaN(value)) {
        return '(no data)';
      }
      return this.format(value, this.collection.options.format);
    }
  });

  return JourneyBar;
});
