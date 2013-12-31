define([
  'extensions/mixins/date-functions'
],
function (dateFunctions) {

  var moment = dateFunctions.moment;

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
    
    it("should count number of arbitrary intervals in a time period", function () {
      var start = moment("05-May-2013");
      var end = moment("26-Jul-2013");

      var months = dateFunctions.numberOfEventsInPeriod(start, end, 'month');
      expect(months).toEqual(2);
      
      var start = moment("2013-05-06T00:00:00+0000");
      var end = moment("2013-05-06T14:00:00+0000");

      var hours = dateFunctions.numberOfEventsInPeriod(start, end, 'hour');
      expect(hours).toEqual(14);
  
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
    
    it("should return a list of arbitrary periods from a given date", function () {
      var dates = dateFunctions.periodsFrom(moment("01-Jul-2013"), 6, 'month');
      expect(dates.length).toBe(6);
      expect(dates[5]).toBeMoment(moment("01-Jul-2013"));
      expect(dates[4]).toBeMoment(moment("01-June-2013"));
      expect(dates[3]).toBeMoment(moment("01-May-2013"));
      expect(dates[2]).toBeMoment(moment("01-Apr-2013"));
      expect(dates[1]).toBeMoment(moment("01-Mar-2013"));
      expect(dates[0]).toBeMoment(moment("01-Feb-2013"));
    });

    describe("Last week date range", function() {
      it("should return last week start and end date", function() {
        var today = moment('2013-05-13 06:45:00').utc();

        var lastWeek = dateFunctions.lastWeekDateRange(today, 0);

        expect(lastWeek.start_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-05-06T00:00:00+0000');
        expect(lastWeek.end_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-05-13T00:00:00+0000');
      });

      it("should return last week start and end date for Sunday", function() {
        var today = moment('2013-03-17 06:45:00').utc();

        var lastWeek = dateFunctions.lastWeekDateRange(today, 0);

        expect(lastWeek.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-04T00:00:00');
        expect(lastWeek.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-03-11T00:00:00');
      });

      it("should return 2 week ago start and end date", function() {
        var today = moment('2013-05-13 06:45:00').utc();

        var lastWeek = dateFunctions.lastWeekDateRange(today, 1);

        expect(lastWeek.start_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-04-29T00:00:00+0000');
        expect(lastWeek.end_at.format('YYYY-MM-DDTHH:mm:ssZZ')).toEqual('2013-05-06T00:00:00+0000');
      });

      it("should return 2 week ago start and end date for Sunday", function() {
        var today = moment('2013-07-21 06:45:00').utc();

        var lastWeek = dateFunctions.lastWeekDateRange(today, 1);

        expect(lastWeek.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-01T00:00:00');
        expect(lastWeek.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-08T00:00:00');
      });

    });
  });
});
