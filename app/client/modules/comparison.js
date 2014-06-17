define([
  'client/controllers/module',
  'common/modules/comparison',
  'common/views/visualisations/grouped_timeseries'
], function (ModuleController, ComparisonModule, GroupedTimeseriesView) {

  return ModuleController.extend(ComparisonModule).extend({

    visualisationClass: GroupedTimeseriesView

  });

});