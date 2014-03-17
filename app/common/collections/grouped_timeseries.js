define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {

  var CategoriesCollection = MatrixCollection.extend({
    queryParams: function () {
      return {
        collect: this.options.valueAttr,
        period: this.options.period,
        group_by: this.options.category,
        filter_by: this.options.filterBy ? this.options.filterBy : [],
        duration: this.options.duration ? this.options.duration : null
      };
    },

    parse: function (response) {
      var data = response.data,
        category = this.options.category,
        valueAttr = this.options.valueAttr;

      if (this.options.showTotalLines) {

        var totalSeries = {};
        totalSeries[category] = 'Total';
        totalSeries[valueAttr] = 0.0;

        var totalValues = [];
        var tmp = {};

        _.each(response.data, function (d) {
          _.each(d.values, function (obj) {
            if (tmp[obj._start_at]) {
              if ((valueAttr in obj) && (obj[valueAttr] !== null)) {
                tmp[obj._start_at][valueAttr] += obj[valueAttr];
              }
            } else {
              tmp[obj._start_at] = {_end_at: obj._end_at};
              tmp[obj._start_at][valueAttr] = (valueAttr in obj) ? obj[valueAttr] : 0;
            }
          });
        });
        _.each(tmp, function (v, i) {
            var t = {_start_at: i, _end_at: v._end_at};
            t[valueAttr] = v[valueAttr];
            totalValues.push(t);
          });

        totalSeries.values = totalValues;
        data.push(totalSeries);
      }

      return _.chain(this.options.axes.y)
                     .filter(function (series) {
                        return _.find(data, function (d) {
                          return d[category] === series.categoryId;
                        });
                      })
                     .map(function (series) {
                        var dataSeries = _.find(data, function (d) {
                          return d[category] === series.categoryId;
                        });

                        return _.extend({
                          id: series.categoryId,
                          title: series.label,
                          href: series.href
                        }, {
                          values: dataSeries.values
                        });
                      })
                     .value();
    }

  });

  return CategoriesCollection;
});
