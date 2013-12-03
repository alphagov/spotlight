define([
  'extensions/collections/matrix',
],
function (MatrixCollection) {

  var VolumetricsCollection = MatrixCollection.extend({
    queryParams: function () {
      return {
        collect: 'value:sum',
        period: 'month',
        group_by: 'geography',
        filter_by: ['key:residential_property_transactions']
      }
    },

    parse: function (response) {
      var data = response.data
          category = this.options.category;

      return _.map(this.options.seriesList, function (series) {
        var dataSeries = _.find(data, function (d) {
          return d[category] === series.id;
        });

        return _.extend({}, series, {
          values: dataSeries.values
        });
      });
    }

  });
  
  return VolumetricsCollection;
});
