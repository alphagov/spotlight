define([
  'common/timezones',
  'moment'
], function (timezones, moment) {
  describe("timezones", function () {
    describe("gb", function () {
      it("should apply BST offset to a summer date", function () {
        var local = timezones.gb.applyOffset(moment("2013-06-01 00:00:00 +00:00"));
        expect(local).toBeMoment(moment("2013-05-31 23:00:00 +00:00"));
      });

      it("should not apply BST offset to a winter date", function () {
        var local = timezones.gb.applyOffset(moment("2013-02-01 00:00:00 +00:00"));
        expect(local).toBeMoment(moment("2013-02-01 00:00:00 +00:00"));
      });

      it("should apply the offset correctly on summer time boundaries", function () {
        expect(timezones.gb.applyOffset(moment("2013-03-31 01:00:00 +00:00"))).toBeMoment(moment("2013-03-31 01:00:00 +00:00"));
        expect(timezones.gb.applyOffset(moment("2013-03-31 02:00:00 +00:00"))).toBeMoment(moment("2013-03-31 01:00:00 +00:00"));
        expect(timezones.gb.applyOffset(moment("2013-10-27 01:00:00 +00:00"))).toBeMoment(moment("2013-10-27 00:00:00 +00:00"));
        expect(timezones.gb.applyOffset(moment("2013-10-27 02:00:00 +00:00"))).toBeMoment(moment("2013-10-27 02:00:00 +00:00"));

        expect(timezones.gb.applyOffset(moment("2015-03-29 01:00:00 +00:00"))).toBeMoment(moment("2015-03-29 01:00:00 +00:00"));
        expect(timezones.gb.applyOffset(moment("2015-03-29 02:00:00 +00:00"))).toBeMoment(moment("2015-03-29 01:00:00 +00:00"));
        expect(timezones.gb.applyOffset(moment("2015-10-25 01:00:00 +00:00"))).toBeMoment(moment("2015-10-25 00:00:00 +00:00"));
        expect(timezones.gb.applyOffset(moment("2015-10-25 02:00:00 +00:00"))).toBeMoment(moment("2015-10-25 02:00:00 +00:00"));
      });
    });
  });
});
