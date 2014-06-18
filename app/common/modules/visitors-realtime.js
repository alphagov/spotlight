define([
  'extensions/controllers/module',
  'common/views/visualisations/visitors-realtime',
  'common/collections/list'
],
function (ModuleController, VisitorsRealtimeView, ListCollection) {
  var VisitorsRealtimeModule = ModuleController.extend({
    visualisationClass: VisitorsRealtimeView,
    collectionClass: ListCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        id: 'realtime',
        title: 'Realtime',
        updateInterval: 120 * 1000,
        dataSource: this.model.get('data-source'),
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
