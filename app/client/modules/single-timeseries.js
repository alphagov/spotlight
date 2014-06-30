define([
  'client/controllers/module',
  'common/modules/single-timeseries',
  'common/views/visualisations/single-timeseries'
], function (ModuleController, SingleStackModule, SingleStackView) {

  return ModuleController.extend(SingleStackModule).extend({

    visualisationClass: SingleStackView

  });

});