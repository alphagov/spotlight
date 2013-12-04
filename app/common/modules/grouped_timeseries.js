define([
  'extensions/controllers/module',
  'common/collections/categories',
  'common/views/visualisations/categories'
],
function (ModuleController, CategoriesCollection, CategoriesView) {

  var GroupedTimeseriesModule = ModuleController.extend({
    className: 'grouped_timeseries',
    visualisationClass: CategoriesView,
    collectionClass: CategoriesCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        valueAttr: this.model.get("value-attr"),
        category: this.model.get("category"),
        period: this.model.get("period"),
        seriesList: this.model.get("series"),
        filterBy: this.model.get("filter-by")
      };
    }

  });

  return GroupedTimeseriesModule;
});
