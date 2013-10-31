define([
  'extensions/controllers/module',
  'common/views/visualisations/realtime',
  'common/collections/visitors-realtime'
],
function (ModuleController, VisitorsRealtimeView, VisitorsRealtimeCollection) {
  var Realtime = ModuleController.extend({
    className: 'realtime',
    visualisationClass: VisitorsRealtimeView,
    collectionClass: VisitorsRealtimeCollection
  });

  return Realtime;
});
