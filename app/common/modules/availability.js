define([
  'extensions/controllers/module',
  'common/views/visualisations/availability',
  'common/collections/availability'
],
function (ModuleController, AvailabilityView, AvailabilityCollection) {
  var AvailabilityModule = ModuleController.extend({
    className: 'availability',
    visualisationClass: AvailabilityView,
    collectionClass: AvailabilityCollection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        axisLabels: _.merge({
          "x": {
            "label": "Time",
            "key": "_timestamp"
          },
          "y": {
            "label": "Service Availability",
            "key": "avgresponse"
          }
        }, this.model.get('axis-labels'))
      };
    }
  });

  return AvailabilityModule;
});
