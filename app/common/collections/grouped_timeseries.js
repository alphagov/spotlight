define([
  'extensions/collections/matrix'
],
function (MatrixCollection) {

  var CategoriesCollection = MatrixCollection.extend({
    queryParams: function () {
      return {
        collect: this.options.valueAttr,
        period: this.options.period,
        start_at: this.options.startAt,
        end_at: this.options.endAt,
        group_by: this.options.category,
        filter_by: this.options.filterBy ? this.options.filterBy : [],
        duration: this.options.duration ? this.options.duration : null
      };
    },

    parse: function (response) {
      var data = response.data,
        category = this.options.category;

      if (this.options.groupMapping) {
        data = this.groupData(data);
      }
      if (this.options.showTotalLines) {
        data = this.createTotals(data);
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
    },

    createTotals: function (data) {
      var totalSeries = {},
        category = this.options.category,
        valueAttr = this.options.valueAttr;

      totalSeries[category] = 'Total';
      totalSeries[valueAttr] = 0.0;

      var totalValues = [];
      var tmp = {};

      _.each(data, function (d) {
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
      return data;
    },

    groupData: function (data) {
      var mapped = {},
        valueAttr = this.options.valueAttr;

      _.each(data, function (d) {
        var key = this.options.groupMapping[d[this.options.category]] || d[this.options.category];

        if (!mapped[key]) {
          mapped[key] = {};
        }
        _.each(d.values, function (obj) {
          if (mapped[key][obj._start_at]) {
            if ((valueAttr in obj) && (obj[valueAttr] !== null)) {
              mapped[key][obj._start_at][valueAttr] += obj[valueAttr];
            }
          } else {
            mapped[key][obj._start_at] = {_end_at: obj._end_at};
            if (valueAttr in obj) {
              mapped[key][obj._start_at][valueAttr] = obj[valueAttr];
            }
          }
        });
      }, this);

      return _.map(mapped, function (values, key) {
        var groupData = {  };
        groupData[this.options.category] = key;
        groupData.values = _.map(values, function (obj, start) {
          return _.extend(obj, {
            _start_at: start
          });
        });
        return groupData;
      }, this);
    }

  });

  return CategoriesCollection;
});
