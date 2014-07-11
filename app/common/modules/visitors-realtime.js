define([
  'common/collections/realtime'
],
function (RealtimeCollection) {
  return {
    requiresSvg: true,
    collectionClass: RealtimeCollection,

    collectionOptions: function () {
      return {
        id: 'realtime',
        title: 'Realtime',
        updateInterval: 120 * 1000,
        axes: _.merge({
          x: {
            label: 'Time',
            key: '_timestamp',
            format: 'time'
          },
          y: [
            {
              label: 'Number of unique visitors',
              key: 'unique_visitors',
              format: 'integer'
            }
          ]
        }, this.model.get('axes'))
      };
    },

    visualisationOptions: function () {
      return {
        valueAttr: 'unique_visitors',
        url: this.url
      };
    }

  };

});
