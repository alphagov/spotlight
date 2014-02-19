define([
  'extensions/controllers/dashboard',
  'common/controllers/error',
  'common/modules/availability',
  'common/modules/completion_numbers',
  'common/modules/completion_rate',
  'common/modules/grouped_timeseries',
  'common/modules/journey',
  'common/modules/list',
  'common/modules/multi_stats',
  'common/modules/visitors-realtime'
],
function (DashboardController, ErrorController,
  AvailabilityModule, CompletionNumbersModule, CompletionRateModule, GroupedTimeseriesModule,
  JourneyModule, ListModule, MultiStatsModule, VisitorsRealtimeModule) {

  var ControllerMap = {
    dashboard: DashboardController,
    error: ErrorController,
    modules: {
      'availability': AvailabilityModule,
      'completion_numbers': CompletionNumbersModule,
      'completion_rate': CompletionRateModule,
      'grouped_timeseries': GroupedTimeseriesModule,
      'journey': JourneyModule,
      'list': ListModule,
      'multi_stats': MultiStatsModule,
      'realtime': VisitorsRealtimeModule
    }
  };

  return ControllerMap;
});
