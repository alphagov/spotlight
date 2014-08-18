define([
  'client/controllers/module',
  'common/modules/single-timeseries',
  'client/views/visualisations/single-timeseries'
], function (ModuleController, SingleTimeseriesModule, SingleStackView) {

  return ModuleController.extend(SingleTimeseriesModule).extend({

    visualisationClass: SingleStackView

  });

});