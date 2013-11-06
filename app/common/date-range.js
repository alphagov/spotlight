define(
function () {
  var MONDAY = 1,
      SUNDAY = 0;

  var lastWeekDateRange = function(date, weeksAgo) {
    weeksAgo = weeksAgo || 0;

    if (date.day() === SUNDAY) {
      weeksAgo += 1;
    }

    var end = date.day(MONDAY).startOf('day').subtract(weeksAgo, 'weeks');

    return {
      start_at: end.clone().subtract(1, 'weeks'),
      end_at: end
    };
  };

  return {
    lastWeekDateRange: lastWeekDateRange
  };
});
