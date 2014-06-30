define([
  './linelabel'
], function (LineLabel) {

  return LineLabel.extend({
    getYIdeal: function (index, attr) {
      var y = this.graph.getYPos(index, attr);
      if (y === null) {
        return null;
      }
      var y0 = this.graph.getY0Pos(index, attr);
      return (y + y0) / 2;
    }
  });

});