define([
  'extensions/controllers/module',
  'common/views/visualisations/visitors-realtime',
  'common/collections/visitors-realtime'
],
function (ModuleController, VisitorsRealtimeView, VisitorsRealtimeCollection) {
  var VisitorsRealtimeModule = ModuleController.extend({
    className: 'realtime',
    visualisationClass: VisitorsRealtimeView,
    collectionClass: VisitorsRealtimeCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        numTwoMinPeriodsToQuery: this.model.get("numTwoMinPeriodsToQuery"),
        axisLabels: this.model.get('axis-labels')
      };
    }
  });

  return VisitorsRealtimeModule;
});
