define([
  'extensions/models/query'
],
function (Query) {

  describe("Query", function () {

    var moment = Query.prototype.moment;

    describe("set", function () {

      beforeEach(function() {
        jasmine.setupMoment('2013-05-15 06:15:45+01:00', Query.prototype);
      });

      it("sets start and end date for 'month' period using constructor", function () {
        var query = new Query({
          foo: 'bar',
          period: 'month'
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format()).toEqual('2013-05-01T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2012-05-01T00:00:00+01:00');
      });

      it("sets start and end date for 'month' period with a custom duration", function () {
        var query = new Query({
          foo: 'bar',
          period: 'month',
          duration: 2
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format()).toEqual('2013-05-01T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2013-03-01T00:00:00+00:00');
        expect(query.get('duration')).not.toBeDefined();
      });

      it("sets start and end date for 'month' period a number of periods ago", function () {
        var query = new Query({
          foo: 'bar',
          period: 'month',
          duration: 1,
          ago: 1
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format()).toEqual('2013-04-01T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2013-03-01T00:00:00+00:00');
        expect(query.get('duration')).not.toBeDefined();
      });

      it("sets start and end date for 'month' period using object syntax", function () {
        var query = new Query({
          a: 'b'
        });
        query.set({
          foo: 'bar',
          period: 'month'
        });
        expect(query.get('a')).toEqual('b');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format()).toEqual('2013-05-01T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2012-05-01T00:00:00+01:00');
      });

      it("sets start and end date for 'month' period using key, value syntax", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set('period', 'month');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('month');
        expect(query.get('end_at').format()).toEqual('2013-05-01T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2012-05-01T00:00:00+01:00');
      });

      it("sets start and end date for 'week' period", function () {
        var query = new Query({ period: 'week' });
        expect(query.get('period')).toEqual('week');
        expect(query.get('end_at').format()).toEqual('2013-05-13T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2013-03-11T00:00:00+00:00');
      });

      it("ignores unknown periods using constructor", function () {
        var query = new Query({
          foo: 'bar',
          period: 'unknown'
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('unknown');
        expect(query.get('end_at')).not.toBeDefined();
        expect(query.get('start_at')).not.toBeDefined();
      });

      it("ignores unknown periods using object syntax", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set({
          period: 'unknown'
        });
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('unknown');
        expect(query.get('end_at')).not.toBeDefined();
        expect(query.get('start_at')).not.toBeDefined();
      });

      it("ignores unknown periods using key, value syntax", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set('period', 'unknown');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('unknown');
        expect(query.get('end_at')).not.toBeDefined();
        expect(query.get('start_at')).not.toBeDefined();
      });

      it("sets correct start and end_at for day period", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set('period', 'day');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('day');
        expect(query.get('end_at').format()).toEqual('2013-05-15T00:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2013-04-15T00:00:00+01:00');
      });

      it("sets correct start and end_at for hour period", function () {
        var query = new Query({
          foo: 'bar'
        });
        query.set('period', 'hour');
        expect(query.get('foo')).toEqual('bar');
        expect(query.get('period')).toEqual('hour');
        expect(query.get('end_at').format()).toEqual('2013-05-15T06:00:00+01:00');
        expect(query.get('start_at').format()).toEqual('2013-05-14T06:00:00+01:00');
      });
    });
  });
});
