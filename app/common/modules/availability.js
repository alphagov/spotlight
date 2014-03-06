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
        axes: _.merge({
          x: {
            label: 'Time',
            key: '_timestamp'
          },
          y: [
            {
              label: 'Page load time',
              key: 'avgresponse'
            },
            {
              label: 'Uptime',
              key: 'uptimeFraction'
            }
          ]
        }, this.model.get('axes'))
      };
    }
  });

  return AvailabilityModule;
});
