define([
  'extensions/controllers/dashboard',
  'common/controllers/error',
  'common/modules/availability',
  'common/modules/comparison',
  'common/modules/completion_numbers',
  'common/modules/completion_rate',
  'common/modules/grouped_timeseries',
  'common/modules/journey',
  'common/modules/kpi',
  'common/modules/list',
  'common/modules/multi_stats',
  'common/modules/tab',
  'common/modules/table',
  'common/modules/user_satisfaction',
  'common/modules/visitors-realtime'
],
function (DashboardController, ErrorController,

  AvailabilityModule, ComparisonModule, CompletionNumbersModule, CompletionRateModule, GroupedTimeseriesModule,
  JourneyModule, KPIModule, ListModule, MultiStatsModule, TabModule, TableModule, UserSatisfactionModule, VisitorsRealtimeModule) {

  var ControllerMap = {
    dashboard: DashboardController,
    error: ErrorController,
    modules: {
      'availability': AvailabilityModule,
      'comparison': ComparisonModule,
      'completion_numbers': CompletionNumbersModule,
      'completion_rate': CompletionRateModule,
      'grouped_timeseries': GroupedTimeseriesModule,
      'journey': JourneyModule,
      'kpi': KPIModule,
      'list': ListModule,
      'multi_stats': MultiStatsModule,
      'tab': TabModule,
      'table': TableModule,
      'user_satisfaction': UserSatisfactionModule,
      'realtime': VisitorsRealtimeModule
    }
  };

  return ControllerMap;
});
