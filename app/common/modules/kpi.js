define([
  'extensions/controllers/module',
  'common/views/visualisations/kpi',
  'extensions/collections/collection'
],
function (ModuleController, KPIView, Collection) {
  return ModuleController.extend({
    visualisationClass: KPIView,
    collectionClass: Collection,

    collectionOptions: function () {
      return {
        dataSource: this.model.get('data-source')
      };
    }

  });
});
