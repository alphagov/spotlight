define(
  function () {
    return (function () {
      return {
        latest: function (objects, filter) {
          var dates = _.map(objects, filter);
          return _.reduce(dates, function (latest, current) {
            return current.isAfter(latest) ? current : latest;
          });
        },

        earliest: function (objects, filter) {
          var dates = _.map(objects, filter);
          return _.reduce(dates, function (earliest, current) {
            return current.isBefore(earliest) ? current : earliest;
          });
        },

        numberOfWeeksInPeriod: function (start, end) {
          return end.diff(start, "week");
        },

        weeksFrom: function (latestDate, numberOfWeeksToGenerate) {
          return _.times(numberOfWeeksToGenerate, function (i) {
            var weeksAgo = numberOfWeeksToGenerate - i - 1;
            return latestDate.clone().subtract(weeksAgo, "weeks");
          });
        }
      }
    }());
  }
);