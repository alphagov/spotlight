define([
  'client/controllers/module',
  'common/modules/grouped_timeseries',
  'client/views/visualisations/grouped_timeseries'
], function (ModuleController, GroupedTimeseriesModule, GroupedTimeseriesView) {

  return ModuleController.extend(GroupedTimeseriesModule).extend({

    visualisationClass: GroupedTimeseriesView

  });

});