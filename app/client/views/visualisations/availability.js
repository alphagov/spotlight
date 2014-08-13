define([
  'common/views/visualisations/availability',
  'client/views/visualisations/availability/uptime-graph',
  'client/views/visualisations/availability/response-time-graph'
],
function (View, UptimeGraph, ResponseTimeGraph) {
  return View.extend({

    views: function () {
      var views = View.prototype.views.apply(this, arguments);
      return _.extend(views, {
        '.uptime-graph': {view: UptimeGraph},
        '.response-time-graph': {view: ResponseTimeGraph}
      });
    }

  });

});
