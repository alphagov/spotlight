define([
  'extensions/models/group',
  'extensions/collections/timeseries'
],
function (Group, Timeseries) {
  describe("Group", function () {
    describe("parse", function () {
      it("converts `values` into a time series", function () {
        var group = new Group([
          {
            foo: 'bar',
            values: [
              {
                _start_at: '2013-02-02T00:00:00+00:00',
                _end_at: '2013-02-09T00:00:00+00:00'
              }
            ]
          }
        ], {parse: true})
        
        expect(group.get('values') instanceof Timeseries).toBe(true);
      });
    });
  });
});
