define([
  'extensions/collections/matrix',
  'extensions/models/query'
],
function (MatrixCollection, Query) {

  var GroupedTimeshiftCollection = MatrixCollection.extend({
    queryParams: function () {
      return {
        collect: this.options.valueAttr,
        period: this.options.period,
        group_by: this.options.category,
        filter_by: this.options.filterBy ? this.options.filterBy : [],
        duration: this.duration()
      };
    },

    standardDuration: function () {
      if (this.options.duration) {
        return this.options.duration;
      } else {
        return Query.prototype.periods[this.options.period].duration;
      }
    },

    duration: function () {
      var maxTimeshift = _.max(this.options.seriesList, function (series) {
        return series.timeshift;
      });
      return maxTimeshift.timeshift + this.standardDuration();
    },

    applyStandardDates: function (seriesList, standard) {
      return _.map(seriesList, function (series) {
        for (var i = 0, _i = series.values.length; i < _i; i++) {
          // copy old values by value rather than reference
          series.values[i]._original_start_at = '' + series.values[i]._start_at;
          series.values[i]._original_end_at = '' + series.values[i]._end_at;

          series.values[i]._start_at = standard[i]._start_at;
          series.values[i]._end_at = standard[i]._end_at;
        }
        return series;
      });
    },

    parse: function (response) {
      var data = response.data;
      var startOffset = this.duration() - this.standardDuration();
      var standardDateValues = data[0].values.slice(startOffset);

      var matchedSeries = _.chain(this.options.seriesList)
                           .filter(function (series) {
                              return _.find(data, function (d) {
                                return d[this.options.category] === series.id;
                              }, this);
                            }, this)
                           .map(function (series) {
                              var dataSeries = _.find(data, function (d) {
                                return d[this.options.category] === series.id;
                              }, this);

                              var start = startOffset;
                              var id = series.id;

                              if (series.timeshift) {
                                id = series.id + series.timeshift;
                                start = startOffset - series.timeshift;
                              }
                              var end = start + this.standardDuration();

                              return _.extend({}, series, {
                                id: id,
                                values: dataSeries.values.slice(start, end)
                              });

                            }, this)
                           .value();

      return this.applyStandardDates(matchedSeries, standardDateValues);
    }

  });

  return GroupedTimeshiftCollection;
});
