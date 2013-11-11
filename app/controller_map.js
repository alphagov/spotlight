define([
  'extensions/controllers/dashboard',
  'common/modules/visitors-realtime',
  'common/modules/journey',
  'common/controllers/error'
],
function (Dashboard, RealtimeModule, JourneyModule, Error) {

  var ControllerMap = {
    'error': Error,
    'dashboard': Dashboard,
    modules: {
      realtime: RealtimeModule,
      journey: JourneyModule
    }
  };

  return ControllerMap;
});
