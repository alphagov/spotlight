define([
  'extensions/controllers/dashboard',
  'common/modules/visitors-realtime',
  'common/modules/journey',
  'common/modules/availability',
  'common/modules/completion_rate',
  'common/modules/completion_numbers',
  'common/modules/multi_stats',
  'common/modules/grouped_timeseries',
  'common/modules/lines',
  'common/controllers/error'
],
function (Dashboard, RealtimeModule, JourneyModule, AvailabilityModule, CompletionRateModule, CompletionNumbersModule, MultiStatsModule, GroupedTimeseriesModule, LinesModule, Error) {

  var ControllerMap = {
    'error': Error,
    'dashboard': Dashboard,
    modules: {
      realtime: RealtimeModule,
      journey: JourneyModule,
      availability: AvailabilityModule,
      completion_rate: CompletionRateModule,
      completion_numbers: CompletionNumbersModule,
      multi_stats: MultiStatsModule,
      grouped_timeseries: GroupedTimeseriesModule
      lines: LinesModule
    }
  };

  return ControllerMap;
});
