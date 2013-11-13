define([
  'extensions/views/tabs',
  'common/views/visualisations/availability/uptime-number',
  'common/views/visualisations/availability/uptime-graph',
  'common/views/visualisations/availability/response-time-number',
  'common/views/visualisations/availability/response-time-graph'
],
function (Tabs, UptimeNumber, UptimeGraph,
          ResponseTimeNumber, ResponseTimeGraph) {
  var TabbedAvailabilityView = Tabs.extend({
  });

  return TabbedAvailabilityView;
});
//    new UptimeNumber({
//      el: moduleEl.find('.uptime'),
//      collection: availabilityCollection
//    });
//
//    new UptimeGraph({
//      el: moduleEl.find('.uptime-graph'),
//      collection: availabilityCollection
//    });
//
//    new ResponseTimeNumber({
//      el: moduleEl.find('.response-time'),
//      collection: availabilityCollection
//    });
//
//    new ResponseTimeGraph({
//      el: moduleEl.find('.response-time-graph'),
//      collection: availabilityCollection
//    });
//
//    var graphNav = new Tabs({
//      el: $("#availability-nav"),
//      model: availabilityCollection.query,
//      attr: 'period',
//      tabs: [
//        {id: "day", name: "30 days"},
//        {id: "hour", name: "24 hours"}
//      ]
//    });
//    graphNav.render();
