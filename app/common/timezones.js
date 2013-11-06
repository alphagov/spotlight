define(
  // FIXME: This is used by the Query model to work around timezone issues.
  // Replace with timezone support in Moment.
  function () {
    var OCTOBER = 9;
    var MARCH = 2;
    var SUNDAY = 0;

    function bstStart(year) {
      return moment.utc([year, MARCH, 31, 2, 0, 0]).day(SUNDAY);
    }

    function bstEnd(year) {
      return moment.utc([year, OCTOBER, 31, 2, 0, 0]).day(SUNDAY);
    }

    function isBST(aMoment) {
      return !bstStart(aMoment.year()).isAfter(aMoment) && bstEnd(aMoment.year()).isAfter(aMoment);
    }

    var timezones = {
      gb: {
        applyOffset: function (aMoment) {
          if (isBST(aMoment)) {
            return aMoment.subtract('hours', 1);
          } else {
            return aMoment;
          }
        }
      },

      utc: {
        applyOffset: function (aMoment) {
          return aMoment;
        }
      }
    };

    return timezones;
});
