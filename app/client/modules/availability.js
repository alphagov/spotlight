define([
  'client/controllers/module',
  'common/modules/availability',
  'common/views/visualisations/availability'
],
function (ModuleController, AvailabilityModule, AvailabilityView) {

  return ModuleController.extend(AvailabilityModule).extend({
    visualisationClass: AvailabilityView
  });

});
