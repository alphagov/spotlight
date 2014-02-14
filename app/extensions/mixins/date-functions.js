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

  /* Configure Moment locale options as per our style guide
   * www.gov.uk/design-principles/style-guide/style-points#style-dates-and-times
   */
  moment.lang('en', {
    calendar: {
      lastDay:  '[yesterday at] LT',
      sameDay:  '[today at] LT',
      nextDay:  '[tomorrow at] LT',
      lastWeek: '[last] dddd [at] LT',
      nextWeek: 'dddd [at] LT',
      sameElse: 'L'
    },
    longDateFormat: {
      LT: 'h:mma',
      L:  'D MMM YYYY'
    },
    monthsShort: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
      'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
  });

  return {
    moment: moment,

    getMoment: function () {
      return this.moment.apply(null, arguments).utc();
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
