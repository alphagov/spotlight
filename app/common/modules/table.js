define([
  'extensions/controllers/module',
  'extensions/views/table',
  'common/collections/list'
],
function (ModuleController, TableView, Collection) {
  var TableModule = ModuleController.extend({
    visualisationClass: TableView,
    collectionClass: Collection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        id: 'list',
        title: 'List',
        dataSource: this.model.get('data-source'),
        axes: this.model.get('axes')
      };
    },

    visualisationOptions: function () {
      return {
        sortBy: this.model.get('sort-by'),
        sortOrder: this.model.get('sort-order') || 'descending'
      };
    }

  });

  return TableModule;
});
