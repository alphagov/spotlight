define([
  'extensions/controllers/dashboard',
  'common/modules/visitors-realtime',
  // 'extensions/controllers/error404',
  // 'extensions/controllers/error500'
],
function (DashboardController, RealtimeModuleController, Error404Controller, Error500Controller) {

  var ControllerMap = {
    // 'error404': Error404Controller,
    // 'error500': Error500Controller,
    'dashboard': DashboardController,
    modules: {
      realtime: RealtimeModuleController
    }
  };

  return ControllerMap;
});
