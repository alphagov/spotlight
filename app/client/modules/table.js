define([
  'client/controllers/module',
  'client/views/table',
  'extensions/collections/collection'
], function (ModuleController, TableView, Collection) {

  return ModuleController.extend({

    visualisationClass: TableView,
    collectionClass: Collection,

    collectionOptions: function () {
      return {
        id: 'list',
        title: 'List',
        queryParams: _.extend({}, {'flatten':true}, this.model.get('query-params')),
        axes: this.model.get('axes')
      };
    }

  });

});
