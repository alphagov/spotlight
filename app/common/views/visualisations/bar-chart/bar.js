define([
  'extensions/views/graph/interleavedbar'
],
function (InterleavedBar) {
  var JourneyBar = InterleavedBar.extend({
    interactive: true,
    strokeAlign: 'inner',

    blockWidth: function () {
      var x0 = this.scales.x(this.graph.getXPos(0, 0));
      var x1 = this.scales.x(this.graph.getXPos(0, 1));
      return x1 - x0;
    },
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
