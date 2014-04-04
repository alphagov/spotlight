define([
  'common/modules/grouped_timeseries',
  'extensions/controllers/module',
  'common/collections/comparison'
],
function (GroupedTimeseriesController, ModuleController, ComparisonCollection) {

  return GroupedTimeseriesController.extend({
    initialize: ModuleController.prototype.initialize,
    collectionClass: ComparisonCollection,
    collectionOptions: function () {
      return _.extend(GroupedTimeseriesController.prototype.collectionOptions.apply(this, arguments), {
        comparison: this.model.get('comparison'),
      });
    }

  });

});
