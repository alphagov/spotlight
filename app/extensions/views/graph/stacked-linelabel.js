define([
  './linelabel'
], function (LineLabel) {

  return LineLabel.extend({
    getYIdeal: function (attr) {
      var index = this.collection.length;
      var val = null;
      while (val === null && index > 0) {
        index--;
        val = this.graph.getYPos(index, attr);
      }
      var y0 = this.graph.getY0Pos(index, attr);
      return (val + y0) / 2;
    }
  });

});