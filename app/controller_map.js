define([
  'extensions/controllers/dashboard',
  'common/modules/visitors-realtime',
  'common/modules/journey',
  'common/modules/availability',
  'common/controllers/error'
],
function (Dashboard, RealtimeModule, JourneyModule, AvailabilityModule, Error) {

  var ControllerMap = {
    'error': Error,
    'dashboard': Dashboard,
    modules: {
      realtime: RealtimeModule,
      journey: JourneyModule,
      availability: AvailabilityModule
    }
  };

  return ControllerMap;
});
