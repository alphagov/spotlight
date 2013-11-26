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
    clientRenderOnInit: true
  });

  return VisitorsRealtimeModule;
});
