define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {

  var CategoriesCollection = MatrixCollection.extend({
    queryParams: function () {
      return {
        collect: (this.options.tabs) ? this.options.tabs[0].id: this.options.valueAttr,
        period: this.options.period,
        group_by: this.options.category,
        filter_by: this.options.filterBy ? this.options.filterBy : [],
        cumulative_values: this.options.cumulative_values,
        include_total: this.options.include_total
      };
    },

    parse: function (response) {
      var data = response.data;
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
  
  return CategoriesCollection;
});
