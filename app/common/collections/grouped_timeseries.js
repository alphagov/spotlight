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

      return _.chain(this.options.axisLabels.y)
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
                          title: series.label
                        }, {
                          values: dataSeries.values
                        });
                      })
                     .value();
    },

    getDataByTableFormat: function () {
      if (this.options.axisLabels && this.options.period) {
        var allTables = [],
          dateRow = this.options.axisLabels.x.label + ' (' + this.options.period + ')',
          dateKey = this.options.axisLabels.x.key,
          seriesList = this.options.axisLabels.y,
          tableHeadings = [];

        tableHeadings.push(dateRow);

        _.each(seriesList, function (series) {
          tableHeadings.push(series.label);
        });

        allTables.push(tableHeadings);

        _.each(this.models, function (collectionOfCollections, index) {
          var series = seriesList[index],
              collection = collectionOfCollections.get('values');

          if (collection.length && index === 0) {
            _.each(collection.models, function (model) {
              var tableRow = new Array(series.length);
              tableRow[0] = this.getMoment(model.get(dateKey))
                .format(this.periods[this.options.period].format.longhand);
              tableRow[1] = model.get(series.key);

              allTables.push(tableRow);
            }, this);
          } else {
            _.each(collection.models, function (model, modelIndex) {
              var tableRow = allTables[modelIndex + 1];
              tableRow[index + 1] = model.get(series.key);
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
