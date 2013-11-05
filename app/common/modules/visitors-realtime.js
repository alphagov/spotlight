define([
  'extensions/controllers/module',
  'common/views/visualisations/realtime',
  'common/collections/visitors-realtime'
],
function (ModuleController, VisitorsRealtimeView, VisitorsRealtimeCollection) {
  var VisitorsRealtimeController = ModuleController.extend({
    className: 'realtime',
    visualisationClass: VisitorsRealtimeView,
    collectionClass: VisitorsRealtimeCollection,
    clientRenderOnInit: true
  });

  return VisitorsRealtimeController;
});
