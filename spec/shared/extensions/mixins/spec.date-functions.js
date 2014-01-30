define([
  'extensions/mixins/date-functions'
],
function (dateFunctions) {

  var moment = dateFunctions.moment;

  describe("date functions mixin", function () {
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
