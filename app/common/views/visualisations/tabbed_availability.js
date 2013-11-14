define([
    //convert to stache
  'tpl!common/templates/visualisations/tabbed_availability.html',
  'extensions/views/view',
  'extensions/views/tabs',
  'common/views/visualisations/availability/uptime-number',
  'common/views/visualisations/availability/uptime-graph',
  'common/views/visualisations/availability/response-time-number',
  'common/views/visualisations/availability/response-time-graph'
],
function (template, View, Tabs, UptimeNumber, UptimeGraph,
          ResponseTimeNumber, ResponseTimeGraph) {
  var TabbedAvailabilityView = View.extend({
    template: template,

    views: {
      //need to be more specific? select inside section?
      '.uptime': {view: UptimeNumber},
      '.uptime-graph': {view: UptimeGraph},
      '.response-time': {view: ResponseTimeNumber},
      '.response-time-graph': {view: ResponseTimeGraph},
      "#availability-nav": {
        view: Tabs,
        options: function (){
          return {
            model: this.collection.query,
            //from stagecraft later
            attr: 'period',
            tabs: [
              {id: "day", name: "30 days"},
              {id: "hour", name: "24 hours"}
            ]
          };
        }
      }
    }
//    initialize: function () {
//      new UptimeNumber({
//        el: moduleEl.find('.uptime'),
//        collection: availabilityCollection
//      });
//
//      new UptimeGraph({
//        el: moduleEl.find('.uptime-graph'),
//        collection: availabilityCollection
//      });
//
//      new ResponseTimeNumber({
//        el: moduleEl.find('.response-time'),
//        collection: availabilityCollection
//      });
//
//      new ResponseTimeGraph({
//        el: moduleEl.find('.response-time-graph'),
//        collection: availabilityCollection
//      });
//
//      var graphNav = new Tabs({
//        el: $("#availability-nav"),
//        model: availabilityCollection.query,
//        attr: 'period',
//        tabs: [
//          {id: "day", name: "30 days"},
//          {id: "hour", name: "24 hours"}
//        ]
//      });
//      Tabs.prototype.initialize.apply(this, arguments);
//    }
  });

  return TabbedAvailabilityView;
});
