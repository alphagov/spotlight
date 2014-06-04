define([
  'common/collections/availability'
],
function (AvailabilityCollection) {
  return {
    collectionClass: AvailabilityCollection,

    collectionOptions: function () {
      return {
        endAt: this.model.get('end-at'),
        period: this.model.get('period'),
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
  };

});
