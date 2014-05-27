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
      var data = response.data;
      this.category = this.options.category;
      this.valueAttr = this.options.valueAttr;

      if (this.options.groupMapping) {
        data = this.groupData(data);
      }
      if (this.options.showTotalLines) {
        data = this.createTotals(data);
      }
      if (this.options.isOneHundredPercent && !this.options.useStack) {
        data = this.transformToPercentages(data);
      }

      return _.chain(this.options.axes.y)
                     .filter(function (series) {
                        return _.find(data, function (d) {
                          return d[this.category] === series.categoryId;
                        }, this);
                      }, this)
                     .map(function (series) {
                        var dataSeries = _.find(data, function (d) {
                          return d[this.category] === series.categoryId;
                        }, this);

                        return _.extend({
                          id: series.categoryId,
                          title: series.label,
                          href: series.href
                        }, {
                          values: dataSeries.values
                        });
                      }, this)
                     .value();
    },

    transformToPercentages: function (data) {

      var dataWithPercentages = _.clone(data);
      var totalSeries = _.find(this.createTotals(data), function(series) {
        return series[this.category] === this.totalSeriesLabel;
      }, this);

      _.each(dataWithPercentages, function (d) {
        _.each(d.values, function (obj, i) {
          obj[this.valueAttr + '_original'] = obj[this.valueAttr];
          obj[this.valueAttr] = obj[this.valueAttr] / totalSeries.values[i][this.valueAttr];
        }, this);
      }, this);

      return dataWithPercentages;
    },

    createTotals: function (data) {

      this.totalSeriesLabel = 'Total';
      var totalSeries = {};

      totalSeries[this.category] = this.totalSeriesLabel;
      totalSeries[this.valueAttr] = 0.0;

      var totalValues = [];
      var tmp = {};

      _.each(data, function (d) {
        _.each(d.values, function (obj) {
          if (tmp[obj._start_at]) {
            if ((this.valueAttr in obj) && (obj[this.valueAttr] !== null)) {
              tmp[obj._start_at][this.valueAttr] += obj[this.valueAttr];
            }
          } else {
            tmp[obj._start_at] = {_end_at: obj._end_at};
            tmp[obj._start_at][this.valueAttr] = (this.valueAttr in obj) ? obj[this.valueAttr] : 0;
          }
        }, this);
      }, this);
      _.each(tmp, function (v, i) {
          var t = {_start_at: i, _end_at: v._end_at};
          t[this.valueAttr] = v[this.valueAttr];
          totalValues.push(t);
        }, this);

      totalSeries.values = totalValues;
      data.push(totalSeries);
      return data;
    },

    groupData: function (data) {
      var mapped = {};

      _.each(data, function (d) {
        var key = this.options.groupMapping[d[this.category]] || d[this.category];

        if (!mapped[key]) {
          mapped[key] = {};
        }
        _.each(d.values, function (obj) {
          if (mapped[key][obj._start_at]) {
            if ((this.valueAttr in obj) && (obj[this.valueAttr] !== null)) {
              mapped[key][obj._start_at][this.valueAttr] += obj[this.valueAttr];
            }
          } else {
            mapped[key][obj._start_at] = {_end_at: obj._end_at};
            if (this.valueAttr in obj) {
              mapped[key][obj._start_at][this.valueAttr] = obj[this.valueAttr];
            }
          }
        }, this);
      }, this);

      return _.map(mapped, function (values, key) {
        var groupData = {  };
        groupData[this.category] = key;
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
