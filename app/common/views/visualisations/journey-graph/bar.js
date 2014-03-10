define([
  'extensions/views/graph/interleavedbar'
],
function (InterleavedBar) {
  var JourneyBar = InterleavedBar.extend({
    interactive: true,
    strokeAlign: 'inner',

    blockWidth: function (group, groupIndex, model, index) {
      var x0 = this.scales.x(this.graph.getXPos(0, 0));
      var x1 = this.scales.x(this.graph.getXPos(0, 1));
      return x1 - x0;
    },
    text: function (model, i) {
      return this.formatNumericLabel(model.get(this.graph.valueAttr) || 0);
    }
  });

  return JourneyBar;
});
