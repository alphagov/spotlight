define([
  'common/views/visualisations/completion_rate',
  'client/views/visualisations/percentage-graph'
], function (View, GraphView) {

  return View.extend({

    views: function () {
      var views = View.prototype.views.apply(this, arguments);
      return _.extend(views, {
        '.volumetrics-completion': {
          view: GraphView,
          options: {
            valueAttr: this.valueAttr
          }
        }
      });
    }

  });

});