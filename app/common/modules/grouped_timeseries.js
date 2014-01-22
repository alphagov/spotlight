define([
  'extensions/controllers/module',
  'common/collections/grouped_timeseries',
  'common/views/visualisations/grouped_timeseries'
],
function (ModuleController, GroupedTimeseriesCollection, GroupedTimeseriesView) {
  
  var GroupedTimeseriesModule = ModuleController.extend({
    className: 'grouped_timeseries',
    visualisationClass: GroupedTimeseriesView,
    collectionClass: GroupedTimeseriesCollection,
    clientRenderOnInit: true,
    requiresSvg: true,
    collectionOptions: function () {
      return {
        tabs: this.model.get("tabs"),
        valueAttr: this.model.get("value-attr"),
        category: this.model.get("category"),
        period: this.model.get("period"),
        currency: this.model.get("currency"),
        seriesList: this.model.get("series"),
        filterBy: this.model.get("filter-by"),
        showTotalLines: this.model.get("show-total-lines"),
        duration: this.model.get("duration")
      };
    }

  });

  return GroupedTimeseriesModule;
});
