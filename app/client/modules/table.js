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
        axes: this.model.get('axes')
      };
    }

  });

});
