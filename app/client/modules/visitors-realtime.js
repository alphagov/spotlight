define([
  'client/controllers/module',
  'common/modules/visitors-realtime',
  'client/views/visualisations/visitors-realtime'
],
function (ModuleController, RealtimeModule, VisitorsRealtimeView) {
  return ModuleController.extend(RealtimeModule).extend({

    visualisationClass: VisitorsRealtimeView,

  });

});
