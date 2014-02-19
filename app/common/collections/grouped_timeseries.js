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
        totalSeries[category] = "Total";
        totalSeries[valueAttr] = 0.0;

        var totalValues = [];
        var tmp = {};

        _.each(response.data, function(d) {
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

      return _.map(this.options.seriesList, function (series) {
        var dataSeries = _.find(data, function (d) {
          return d[category] === series.id;
        });

        return _.extend({}, series, {
          values: dataSeries.values
        });
      });
    },

    getDataByTableFormat: function () {
      if (this.options.axisLabels && this.options.seriesList && this.options.period) {
        var allTables = [],
          dateRow = this.options.axisLabels.x.label + ' (' + this.options.period + ')',
          dateKey = this.options.axisLabels.x.key,
          series = this.options.seriesList,
          seriesLength = series.length,
          seriesData = this.options.axisLabels.y.key,
          tableHeadings = [];

        tableHeadings.push(dateRow);

        _.each(series, function (item) {
          tableHeadings.push(item.title);
        });

        allTables.push(tableHeadings);
        _.each(this.models, function (collectionOfCollections, index) {
          var collection = collectionOfCollections.get('values');

          if (collection.length && index === 0) {
            _.each(collection.models, function (model) {
              var tableRow = new Array(seriesLength + 1);
              tableRow[0] = this.getMoment(model.get(dateKey))
                .format(this.periods[this.options.period].format.long);
              tableRow[1] = model.get(seriesData);

              allTables.push(tableRow);
            }, this);
          } else {
            _.each(collection.models, function (model, modelIndex) {
              var tableRow = allTables[modelIndex + 1];
              tableRow[index + 1] = model.get(seriesData);
            });
          }
        }, this);

        return allTables;
      }

      return MatrixCollection.prototype.getDataByTableFormat.apply(this, arguments);
    }

  });

  return CategoriesCollection;
});
