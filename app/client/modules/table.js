define([
  'client/controllers/module',
  'common/modules/table',
  'client/views/table'
], function (ModuleController, TableModule, TableView) {

  return ModuleController.extend(TableModule).extend({

    visualisationClass: TableView,
    collectionClass: null

  });

});