define([
  'client/controllers/module',
  'common/modules/comparison',
  'client/views/visualisations/grouped_timeseries'
], function (ModuleController, ComparisonModule, GroupedTimeseriesView) {

  return ModuleController.extend(ComparisonModule).extend({

    visualisationClass: GroupedTimeseriesView

  });

});