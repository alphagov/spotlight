define([
  'extensions/controllers/module',
//possibly make configureable parts with view config later?
  'common/views/visualisations/tabbed_availability',
  'common/collections/availability'
],
function (ModuleController, TabbedAvailabilityView, AvailabilityCollection) {
  var AvailabilityController = ModuleController.extend({
    className: 'availability',
    visualisationClass: TabbedAvailabilityView,
    collectionClass: AvailabilityCollection,
    clientRenderOnInit: true
  });

  return AvailabilityController;
});
//define([
//  'extensions/collections/availability',
//  'extensions/views/availability/uptime-number',
//  'extensions/views/availability/uptime-graph',
//  'extensions/views/availability/response-time-number',
//  'extensions/views/availability/response-time-graph',
//  'extensions/views/tabs'
//],
//function (AvailabilityCollection,
//          UptimeNumber, UptimeGraph,
//          ResponseTimeNumber, ResponseTimeGraph,
//          Tabs) {
//
//  return function (serviceName, locator) {
//
//    var availabilityCollection = new AvailabilityCollection(null, {
//      serviceName: serviceName
//    });
//
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
//
//    availabilityCollection.fetch();
//  };
//  
//});
