define([
  'client/controllers/module',
  'common/modules/visitors-realtime',
  'client/collections/realtime',
  'client/views/visualisations/visitors-realtime'
],
function (ModuleController, RealtimeModule, RealtimeCollection, VisitorsRealtimeView) {

  return ModuleController.extend(RealtimeModule).extend({

    visualisationClass: VisitorsRealtimeView,

    collectionClass: RealtimeCollection

  });

});
