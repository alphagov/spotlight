define([
  'extensions/collections/timeseries'
],
function (Timeseries) {
  describe("Timeseries", function () {
    it("keeps entries sorted chronologically", function () {
      var t = new Timeseries([
        {
          _start_at: '2013-02-16T00:00:00+00:00',
          _end_at: '2013-02-23T00:00:00+00:00',
          _count: 1
        },
        {
          _start_at: '2013-02-09T00:00:00+00:00',
          _end_at: '2013-02-016T00:00:00+00:00',
          _count: 1
        },
        {
          _start_at: '2013-02-02T00:00:00+00:00',
          _end_at: '2013-02-09T00:00:00+00:00',
          _count: 1
        }
      ], { parse: true });
      expect(t.at(0).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-02');
      expect(t.at(1).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-09');
      expect(t.at(2).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-16');
    });

    it("sorts on _timestamp if we don't have a _start_at", function() {
      var t = new Timeseries([
        {
          _timestamp: '2013-02-09T00:00:00+00:00',
          _count: 1
        },
        {
          _timestamp: '2013-02-16T00:00:00+00:00',
          _count: 1
        },
        {
          _timestamp: '2013-02-02T00:00:00+00:00',
          _count: 1
        }
      ], { parse: true });
      expect(t.at(0).get('_timestamp').format('YYYY-MM-DD')).toEqual('2013-02-02');
      expect(t.at(1).get('_timestamp').format('YYYY-MM-DD')).toEqual('2013-02-09');
      expect(t.at(2).get('_timestamp').format('YYYY-MM-DD')).toEqual('2013-02-16');
    });

    it("prioritises _start_at even if there is a _timestamp", function () {
      var t = new Timeseries([
        {
          _start_at: '2013-02-16T00:00:00+00:00',
          _end_at: '2013-02-23T00:00:00+00:00',
          _timestamp: '2013-02-02T00:00:00+00:00',
          _count: 1
        },
        {
          _start_at: '2013-02-09T00:00:00+00:00',
          _end_at: '2013-02-016T00:00:00+00:00',
          _timestamp: '2013-02-09T00:00:00+00:00',
          _count: 1
        },
        {
          _start_at: '2013-02-02T00:00:00+00:00',
          _end_at: '2013-02-09T00:00:00+00:00',
          _timestamp: '2013-02-16T00:00:00+00:00',
          _count: 1
        }
      ], { parse: true });
      expect(t.at(0).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-02');
      expect(t.at(1).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-09');
      expect(t.at(2).get('_start_at').format('YYYY-MM-DD')).toEqual('2013-02-16');
    });

  });
});
