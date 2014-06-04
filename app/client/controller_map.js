define([
  'extensions/controllers/dashboard',
  'common/controllers/error',
  'client/modules/availability',
  'client/modules/bar_chart_with_number',
  //'common/modules/comparison',
  'client/modules/completion_numbers',
  'client/modules/completion_rate',
  'client/modules/grouped_timeseries',
  'client/modules/journey',
  'common/modules/list',
  'common/modules/multi_stats',
  'client/modules/tab',
  'client/modules/table',
  'client/modules/user_satisfaction_graph',
  'client/modules/visitors-realtime',
  'client/controllers/services'
],
function (DashboardController, ErrorController,

  AvailabilityModule, BarChartWithNumberModule, /*ComparisonModule,*/ CompletionNumbersModule,
  CompletionRateModule, GroupedTimeseriesModule, JourneyModule,
  ListModule, MultiStatsModule, TabModule, TableModule,
  UserSatisfactionGraphModule, VisitorsRealtimeModule, ServicesController) {

  var ControllerMap = {
    dashboard: DashboardController,
    error: ErrorController,
    services: ServicesController,
    modules: {
      availability:           AvailabilityModule,
      bar_chart_with_number:  BarChartWithNumberModule,
      //comparison:             ComparisonModule,
      completion_numbers:     CompletionNumbersModule,
      completion_rate:        CompletionRateModule,
      grouped_timeseries:     GroupedTimeseriesModule,
      journey:                JourneyModule,
      list:                   ListModule,
      multi_stats:            MultiStatsModule,
      tab:                    TabModule,
      table:                  TableModule,
      user_satisfaction_graph: UserSatisfactionGraphModule,
      realtime:               VisitorsRealtimeModule
    }
  };

  return ControllerMap;
});
