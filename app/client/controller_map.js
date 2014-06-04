define([
  'extensions/controllers/dashboard',
  'common/controllers/error',
  'client/modules/availability',
  'common/modules/bar_chart_with_number',
  //'common/modules/comparison',
  'common/modules/completion_numbers',
  'client/modules/completion_rate',
  'client/modules/grouped_timeseries',
  'client/modules/journey',
  'common/modules/kpi',
  'common/modules/list',
  'common/modules/multi_stats',
  'client/modules/tab',
  'client/modules/table',
  'common/modules/user_satisfaction',
  'client/modules/user_satisfaction_graph',
  'common/modules/visitors-realtime',
  'client/controllers/services'
],
function (DashboardController, ErrorController,

  AvailabilityModule, BarChartWithNumberModule, /*ComparisonModule,*/ CompletionNumbersModule,
  CompletionRateModule, GroupedTimeseriesModule, JourneyModule, KPIModule,
  ListModule, MultiStatsModule, TabModule, TableModule, UserSatisfactionModule,
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
      kpi:                    KPIModule,
      list:                   ListModule,
      multi_stats:            MultiStatsModule,
      tab:                    TabModule,
      table:                  TableModule,
      user_satisfaction:      UserSatisfactionModule,
      user_satisfaction_graph: UserSatisfactionGraphModule,
      realtime:               VisitorsRealtimeModule
    }
  };

  return ControllerMap;
});
