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
      return (!_.isNull(value)) ? this.formatNumericLabel(value) : '(no data)';
    }
  });

  return JourneyBar;
});
