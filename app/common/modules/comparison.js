define([
  'common/modules/grouped_timeseries',
  'extensions/controllers/module',
  'common/collections/comparison'
],
function (GroupedTimeseriesController, ModuleController, ComparisonCollection) {

  return _.extend({}, GroupedTimeseriesController, {
    requiresSvg: true,

    initialize: ModuleController.prototype.initialize,
    collectionClass: ComparisonCollection,

    collectionOptions: function () {
      var options = GroupedTimeseriesController.collectionOptions.apply(this, arguments);
      return _.extend(options, {
        comparison: this.model.get('comparison'),
      });
    }

  });

});
