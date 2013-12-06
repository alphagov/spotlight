define([
  'extensions/controllers/module',
  'common/collections/grouped_timeseries',
  'common/views/visualisations/grouped_timeseries'
],
function (ModuleController, GroupedTimeseriesCollection, GroupedTimeseriesView) {

  var GroupedTimeseriesModule = ModuleController.extend({
    className: 'grouped-timeseries',
    visualisationClass: GroupedTimeseriesView,
    collectionClass: GroupedTimeseriesCollection,
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
