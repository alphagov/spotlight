define([
  'extensions/controllers/module',
  'extensions/collections/matrix',
  'common/views/visualisations/stacked-graph'
],
function (ModuleController, MatrixCollection, StackedGraph) {

  // TODO: move this to separate file and move/write tests
  var VolumetricsCollection = MatrixCollection.extend({
    queryParams: function () {
      return {
        collect: 'value:sum',
        period: 'month',
        group_by: 'geography',
        filter_by: ['key:residential_property_transactions']
      }
    },

    seriesList: [
      { id: 'England', title: 'England' },
      { id: 'Scotland', title: 'Scotland' }
    ],

    parse: function (response) {
      var data = response.data;

      return _.map(this.seriesList, function (series) {
        var dataSeries = _.find(data, function (d) {
          return d.geography === series.id;
        });

        return _.extend({}, series, {
          values: dataSeries.values
        });
      });
    }

  });
  
  var StackedModule = ModuleController.extend({
    className: 'stacked',
    visualisationClass: StackedGraph,
    collectionClass: VolumetricsCollection,
    clientRenderOnInit: true,
    requiresSvg: true
  });

  return StackedModule;
});
