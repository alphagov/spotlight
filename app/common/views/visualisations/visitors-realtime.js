define([
  'extensions/views/view'
],
function (View) {
  return View.extend({

    noDataMessage: '<span class="no-data">(no data)</span>',

    getCurrentVisitors: function () {
      if (this.collection && this.collection.length) {
        var val = this.collection.last().get(this.valueAttr);
        val = Math.round(val);
        this.currentVisitors = val;
        return val;
      } else {
        return null;
      }
    }

  });

});
