define([
  'extensions/controllers/module_controller',
  'common/views/visualisations/realtime',
  'common/collections/visitors-realtime'
],
function (ModuleController, VisitorsRealtimeView, VisitorsRealtimeCollection) {
  var Realtime = ModuleController.extend({
    viewClass: VisitorsRealtimeView,
    collectionClass: VisitorsRealtimeCollection
  });

  return Realtime;
});
