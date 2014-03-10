define([
  'extensions/controllers/module',
  'extensions/views/table',
  'common/collections/list'
],
function (ModuleController, TableView, Collection) {
  var TableModule = ModuleController.extend({
    visualisationClass: TableView,
    collectionClass: Collection,
    clientRenderOnInit: false,
    requiresSvg: false,

    collectionOptions: function () {
      return {
        id: 'list',
        title: 'List',
        queryParams: this.model.get('query-params'),
        axes: this.model.get('axes')
      };
    }
  });

  return TableModule;
});
