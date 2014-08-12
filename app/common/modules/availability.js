define([
  'common/collections/availability'
],
function (AvailabilityCollection) {
  return {
    requiresSvg: true,
    collectionClass: AvailabilityCollection,

    collectionOptions: function () {
      return {
        axes: _.merge({
          x: {
            label: 'Time',
            key: '_timestamp',
            format: 'date'
          },
          y: [
            {
              label: 'Page load time',
              key: 'avgresponse:mean',
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
  };

});
