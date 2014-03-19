define([
  'extensions/controllers/module',
  'common/views/visualisations/kpi',
  'extensions/collections/collection'
],
function (ModuleController, KPIView, Collection) {
  return ModuleController.extend({
    visualisationClass: KPIView,
    collectionClass: Collection,
    clientRenderOnInit: true,
    requiresSvg: true,

    collectionOptions: function () {
      return {
        queryParams: this.model.get('query-params')
      };
    }

  });
});
