define([
  'moment-timezone',
  'vendor/timezones/europe_london'
],
function (moment) {


  // FIXME: Work around bug in moment-timezone
  // https://github.com/moment/moment-timezone/issues/28
  // Remove when issue is resolved
  var oldDateFunction = moment.fn.date;
  moment.fn.date = function() {
      if (arguments.length >= 1) {
          var oldOffset = this.zone();
          var result = oldDateFunction.apply(this, arguments);
          var newOffset = this.zone();
          this.add('minutes', newOffset - oldOffset);//restore proper time
          return result;
      } else {
          return oldDateFunction.apply(this, arguments);
      }
  };
  moment.fn.dates = moment.fn.date;

  var oldStartOfFunction = moment.fn.startOf;
  moment.fn.startOf = function(units) {
      if (units === 'day' || units === 'days' || units === 'd') {
          var oldOffset = this.zone();
          var result = oldStartOfFunction.apply(this, arguments);
          var newOffset = this.zone();
          this.add('minutes', newOffset - oldOffset);//restore proper time
          return result;     
      } else {
          return oldStartOfFunction.apply(this, arguments);
      }
  };

  // Use month short names as per our style guide. 
  moment.lang('en', {
      monthsShort : [
          "Jan", "Feb", "Mar", "Apr", "May", "June",
          "July", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]
  });

  return {
    moment: moment,

    getMoment: function () {
      return this.moment.apply(null, arguments).utc();
    },

    latest: function (objects, filter) {
      var dates = _.map(objects, filter, this);
      if (dates.length < 1){
        return dates.first;
      }
      var res = _.reduce(dates, function (latest, current) {
        return !latest || current.isAfter(latest) ? current : latest;
      }, null, this);
      return res;
    },

    earliest: function (objects, filter) {
      var dates = _.map(objects, filter, this);
      if (dates.length < 1){
        return dates.first;
      }
      return _.reduce(dates, function (earliest, current) {
        return !earliest || current.isBefore(earliest) ? current : earliest;
      }, null, this);
    },

    numberOfWeeksInPeriod: function (start, end) {
      return end.diff(start, "week");
    },
    
    numberOfEventsInPeriod: function (start, end, period) {
      return end.diff(start, period);
    },

    weeksFrom: function (latestDate, numberOfWeeksToGenerate) {
      return _.times(numberOfWeeksToGenerate, function (i) {
        var weeksAgo = numberOfWeeksToGenerate - i - 1;
        return latestDate.clone().subtract(weeksAgo, "weeks");
      }, this);
    },
    
    periodsFrom: function (latestDate, numberOfPeriodsToGenerate, period) {
      return _.times(numberOfPeriodsToGenerate, function (i) {
        var periodsAgo = numberOfPeriodsToGenerate - i - 1;
        return latestDate.clone().subtract(periodsAgo, period);
      }, this);
    },

    MONDAY: 1,
    SUNDAY: 0,

    lastWeekDateRange: function(date, weeksAgo) {
      weeksAgo = weeksAgo || 0;

      if (date.day() === this.SUNDAY) {
        weeksAgo += 1;
      }

      var end = date.day(this.MONDAY).startOf('day').subtract(weeksAgo, 'weeks');

      return {
        start_at: end.clone().subtract(1, 'weeks'),
        end_at: end
      };
    }
  };
});
