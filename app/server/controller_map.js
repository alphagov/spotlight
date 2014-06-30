var DashboardController  = require('./controllers/dashboard');
var ErrorController      = require('./controllers/error');

var AvailabilityModule            = require('./modules/availability');
var BarChartWithNumberModule      = require('./modules/bar_chart_with_number');
var ComparisonModule              = require('./modules/comparison');
var CompletionRateModule          = require('./modules/completion_rate');
var GroupedTimeseriesModule       = require('./modules/grouped_timeseries');
var JourneyModule                 = require('./modules/journey');
var KPIModule                     = require('./modules/kpi');
var ListModule                    = require('./modules/list');
var TimeseriesModule              = require('./modules/single-timeseries');
var TabModule                     = require('./modules/tab');
var TableModule                   = require('./modules/table');
var UserSatisfactionModule        = require('./modules/user_satisfaction');
var UserSatisfactionGraphModule   = require('./modules/user_satisfaction_graph');
var VisitorsRealtimeModule        = require('./modules/visitors-realtime');

module.exports = function () {
  return {
    dashboard: DashboardController,
    error: ErrorController,
    modules: {
      availability:           AvailabilityModule,
      bar_chart_with_number:  BarChartWithNumberModule,
      comparison:             ComparisonModule,
      completion_rate:        CompletionRateModule,
      grouped_timeseries:     GroupedTimeseriesModule,
      journey:                JourneyModule,
      kpi:                    KPIModule,
      list:                   ListModule,
      single_timeseries:      TimeseriesModule,
      tab:                    TabModule,
      table:                  TableModule,
      user_satisfaction:      UserSatisfactionModule,
      user_satisfaction_graph: UserSatisfactionGraphModule,
      realtime:               VisitorsRealtimeModule
    }
  };
};
