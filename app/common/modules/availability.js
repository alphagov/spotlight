define([
  'extensions/controllers/module',
  'common/views/visualisations/tabbed_availability',
  'common/collections/availability'
],
function (ModuleController, TabbedAvailabilityView, AvailabilityCollection) {
  var AvailabilityController = ModuleController.extend({
    className: 'availability',
    visualisationClass: TabbedAvailabilityView,
    collectionClass: AvailabilityCollection,
    clientRenderOnInit: true
  });

  return AvailabilityController;
});
