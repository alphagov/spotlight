define([
  'extensions/mixins/date-functions',
  'moment'
],
function (dateFunctions, moment) {
    describe("date functions mixin", function () {
      it("should find the latest date in a list of objects", function () {
        var latestDate = dateFunctions.latest([
          { d: moment("26-Jul-2013") },
          { d: moment("27-Jul-2013") },
          { d: moment("28-Jul-2013") }
        ], function (obj) {
          return obj.d;
        });

        expect(latestDate).toBeMoment(moment("28-Jul-2013"));
      });

      it("should find the earliest date in a list of objects", function () {
        var latestDate = dateFunctions.earliest([
          { d: moment("26-Jul-2013") },
          { d: moment("27-Jul-2013") },
          { d: moment("28-Jul-2013") }
        ], function (obj) {
          return obj.d;
        });

        expect(latestDate).toBeMoment(moment("26-Jul-2013"));
      });

      it("should count number of weeks in a time period", function () {
        var start = moment("05-Jul-2013");
        var end = moment("26-Jul-2013");

        var weeks = dateFunctions.numberOfWeeksInPeriod(start, end);

        expect(weeks).toEqual(3);
      });

      it("should return undefined when no objects supplied", function () {
        expect(dateFunctions.latest([], function() {})).toBeUndefined();
      });

      it("should return undefined when no objects supplied", function () {
        expect(dateFunctions.earliest([], function() {})).toBeUndefined();
      });

      it("should return a list of dates from a given date", function () {
        var dates = dateFunctions.weeksFrom(moment("22-Jul-2013"), 9);
        expect(dates.length).toBe(9);
        expect(dates[8]).toBeMoment(moment("22-Jul-2013"));
        expect(dates[7]).toBeMoment(moment("15-Jul-2013"));
        expect(dates[6]).toBeMoment(moment("08-Jul-2013"));
        expect(dates[5]).toBeMoment(moment("01-Jul-2013"));
        expect(dates[4]).toBeMoment(moment("24-June-2013"));
        expect(dates[3]).toBeMoment(moment("17-June-2013"));
        expect(dates[2]).toBeMoment(moment("10-June-2013"));
        expect(dates[1]).toBeMoment(moment("03-June-2013"));
        expect(dates[0]).toBeMoment(moment("27-May-2013"));
      });
    });
  }
);
