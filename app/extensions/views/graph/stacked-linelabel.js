define([
  './linelabel'
], function (LineLabel) {

  return LineLabel.extend({
    getYIdeal: function (groupIndex, index) {
      var y = this.graph.getYPos(groupIndex, index);
      if (y === null) {
        return null;
      }
      var y0 = this.graph.getY0Pos(groupIndex, index);
      return (y + y0) / 2;
    }
  });

});