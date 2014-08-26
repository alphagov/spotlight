define([
  'client/controllers/dashboard',
  'client/modules/availability',
  'client/modules/bar_chart_with_number',
  'client/modules/comparison',
  'client/modules/single-timeseries',
  'client/modules/completion_rate',
  'client/modules/grouped_timeseries',
  'client/modules/journey',
  'client/modules/tab',
  'client/modules/table',
  'client/modules/completion_table',
  'client/modules/user_satisfaction_graph',
  'client/modules/visitors-realtime',
  'client/controllers/services'
],
function (DashboardController,

  AvailabilityModule, BarChartWithNumberModule, ComparisonModule, TimeseriesModule,
  CompletionRateModule, GroupedTimeseriesModule, JourneyModule,
  TabModule, TableModule, CompletionTableModule,
  UserSatisfactionGraphModule, VisitorsRealtimeModule, ServicesController) {

  var ControllerMap = {
    dashboard: DashboardController,
    services: ServicesController,
    modules: {
      availability:           AvailabilityModule,
      bar_chart_with_number:  BarChartWithNumberModule,
      comparison:             ComparisonModule,
      completion_rate:        CompletionRateModule,
      completion_table:       CompletionTableModule,
      grouped_timeseries:     GroupedTimeseriesModule,
      journey:                JourneyModule,
      single_timeseries:      TimeseriesModule,
      tab:                    TabModule,
      table:                  TableModule,
      user_satisfaction_graph: UserSatisfactionGraphModule,
      realtime:               VisitorsRealtimeModule
    }
  };

  return ControllerMap;
});
