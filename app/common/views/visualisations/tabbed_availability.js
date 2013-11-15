define([
  'stache!common/templates/visualisations/tabbed_availability',
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
      '.uptime': {view: UptimeNumber},
      '.uptime-graph': {view: UptimeGraph},
      '.response-time': {view: ResponseTimeNumber},
      '.response-time-graph': {view: ResponseTimeGraph},
      "#availability-nav": {
        view: Tabs,
        options: function (){
          return {
            model: this.collection.query,
            attr: this.model.get('tabbed_attr'),
            tabs: this.model.get('tabs')
          };
        }
      }
    }
  });

  return TabbedAvailabilityView;
});
