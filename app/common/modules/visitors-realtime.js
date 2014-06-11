define([
  'common/collections/realtime'
],
function (RealtimeCollection) {
  return {
    collectionClass: RealtimeCollection,

    collectionOptions: function () {
      return {
        id: 'realtime',
        title: 'Realtime',
        updateInterval: 120 * 1000,
        queryParams: {
          sort_by: '_timestamp:descending',
          limit: this.model.get('numTwoMinPeriodsToQuery') || (((60 / 2) * 24) + 2)
        },
        fetchOptions: { headers: { 'cache-control': 'max-age=120' } },
        period: this.model.get('period') || 'hours',
        duration: this.model.get('duration') || 24,
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
