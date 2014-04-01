define([
  'stache!common/templates/visualisations/availability',
  'extensions/views/view',
  'common/views/visualisations/availability/uptime-number',
  'common/views/visualisations/availability/uptime-graph',
  'common/views/visualisations/availability/response-time-number',
  'common/views/visualisations/availability/response-time-graph'
],
function (template, View, UptimeNumber, UptimeGraph,
          ResponseTimeNumber, ResponseTimeGraph) {
  var AvailabilityView = View.extend({
    template: template,

    views: {
      '.uptime': {view: UptimeNumber},
      '.uptime-graph': {view: UptimeGraph},
      '.response-time': {view: ResponseTimeNumber},
      '.response-time-graph': {view: ResponseTimeGraph}
    }
  });

  return AvailabilityView;
});
