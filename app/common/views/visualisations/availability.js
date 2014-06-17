define([
  'extensions/views/view',
  'common/views/visualisations/availability/uptime-number',
  'common/views/visualisations/availability/uptime-graph',
  'common/views/visualisations/availability/response-time-number',
  'common/views/visualisations/availability/response-time-graph'
],
function (View, UptimeNumber, UptimeGraph,
          ResponseTimeNumber, ResponseTimeGraph) {
  return View.extend({

    views: function () {
      return {
        '.uptime': {view: UptimeNumber},
        '.uptime-graph': {view: UptimeGraph},
        '.response-time': {view: ResponseTimeNumber},
        '.response-time-graph': {view: ResponseTimeGraph}
      };
    }

  });

});
