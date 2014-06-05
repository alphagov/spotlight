define([
  'client/controllers/dashboard',
  'client/modules/availability',
  'client/modules/bar_chart_with_number',
  //'common/modules/comparison',
  'client/modules/completion_numbers',
  'client/modules/completion_rate',
  'client/modules/grouped_timeseries',
  'client/modules/journey',
  'common/modules/multi_stats',
  'client/modules/tab',
  'client/modules/table',
  'client/modules/user_satisfaction_graph',
  'client/modules/visitors-realtime',
  'client/controllers/services'
],
function (DashboardController,

  AvailabilityModule, BarChartWithNumberModule, /*ComparisonModule,*/ CompletionNumbersModule,
  CompletionRateModule, GroupedTimeseriesModule, JourneyModule,
  MultiStatsModule, TabModule, TableModule,
  UserSatisfactionGraphModule, VisitorsRealtimeModule, ServicesController) {

  var ControllerMap = {
    dashboard: DashboardController,
    services: ServicesController,
    modules: {
      availability:           AvailabilityModule,
      bar_chart_with_number:  BarChartWithNumberModule,
      //comparison:             ComparisonModule,
      completion_numbers:     CompletionNumbersModule,
      completion_rate:        CompletionRateModule,
      grouped_timeseries:     GroupedTimeseriesModule,
      journey:                JourneyModule,
      multi_stats:            MultiStatsModule,
      tab:                    TabModule,
      table:                  TableModule,
      user_satisfaction_graph: UserSatisfactionGraphModule,
      realtime:               VisitorsRealtimeModule
    }
  };

  return ControllerMap;
});
