define([
  'require',
  './interleavedbar'
],
function(require, InterleavedBarComponent) {
  var StackedBarComponent = InterleavedBarComponent.extend({
    
    align: 'centre',

    x: function (group, groupIndex, model, index) {
      return this.scales.x(this.graph.getXPos(groupIndex, index));
    },

    y0: function (groupIndex, modelIndex) {
      return this.graph.getY0Pos(groupIndex, modelIndex);
    }
    
  });

  return StackedBarComponent;
});