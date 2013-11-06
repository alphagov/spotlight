define([
  'extensions/controllers/dashboard',
  'common/modules/visitors-realtime',
  'common/controllers/error'
],
function (Dashboard, RealtimeModule, Error) {

  var ControllerMap = {
    'error': Error,
    'dashboard': Dashboard,
    modules: {
      realtime: RealtimeModule
    }
  };

  return ControllerMap;
});
