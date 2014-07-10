define([
  'client/controllers/module',
  'client/views/table'
], function (ModuleController, TableView) {

  return ModuleController.extend({

    visualisationClass: TableView,
    collectionClass: null

  });

});