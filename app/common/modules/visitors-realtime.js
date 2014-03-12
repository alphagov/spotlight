define([
  'extensions/controllers/module',
  'common/views/visualisations/visitors-realtime',
  'common/collections/list'
],
function (ModuleController, VisitorsRealtimeView, ListCollection) {
  var VisitorsRealtimeModule = ModuleController.extend({
    className: 'realtime',
    visualisationClass: VisitorsRealtimeView,
    collectionClass: ListCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
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
    }
  });

  return VisitorsRealtimeModule;
});
