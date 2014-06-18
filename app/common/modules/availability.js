define([
  'extensions/controllers/module',
  'common/views/visualisations/availability',
  'common/collections/availability'
],
function (ModuleController, AvailabilityView, AvailabilityCollection) {
  var AvailabilityModule = ModuleController.extend({
    visualisationClass: AvailabilityView,
    collectionClass: AvailabilityCollection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        dataSource: this.model.get('data-source'),
        axes: _.merge({
          x: {
            label: 'Time',
            key: '_timestamp',
            format: 'date'
          },
          y: [
            {
              label: 'Page load time',
              key: 'avgresponse',
              format: 'duration'
            },
            {
              label: 'Uptime',
              key: 'uptimeFraction',
              format: 'percent'
            }
          ]
        }, this.model.get('axes'))
      };
    }
  });

  return AvailabilityModule;
});
