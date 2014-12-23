define([
  'extensions/models/data_source',
  'moment-timezone'
],
function(DataSource, moment) {

  describe('DataSource', function () {
    describe('groupedBy', function () {
      it('should return null if no params', function () {
        var source = new DataSource({});
        expect(source.groupedBy()).toBe(null);
      });

      it('should return null if params + !group_by', function () {
        var source = new DataSource({ 'query-params': {} });
        expect(source.groupedBy()).toBe(null);
      });

      it('should return field if params + group_by', function () {
        var source = new DataSource({ 'query-params': {
          group_by: 'foo'
        } });
        expect(source.groupedBy()).toBe('foo');
      });
    });

    describe('isFlat', function () {
      it('should return false if flatten param is undefined', function () {
        var source = new DataSource({ 'query-params': {}});
        expect(source.isFlat()).toBe(false);
      });
      it('should return false if flatten param is false', function () {
        var source = new DataSource({ 'query-params': {
          'flatten': false
        }});
        expect(source.isFlat()).toBe(false);
      });
      it('should return true if flatten param is true', function () {
        var source = new DataSource({ 'query-params': {
          'flatten': true
        }});
        expect(source.isFlat()).toBe(true);
      });
      it('should return false if query-params is undefined', function () {
        var source = new DataSource({});
        expect(source.isFlat()).toBe(false);
      });
      describe('if flatten everything', function () {
        it('should return false if flatten param is false', function () {
          var source = new DataSource({ 'query-params': {
            'flatten': false
          }}, { flattenEverything: true });
          expect(source.isFlat()).toBe(false);
        });
        it('should return false if query-params is undefined', function () {
          var source = new DataSource({}, { flattenEverything: true });
          expect(source.isFlat()).toBe(true);
        });
      });
    });

    describe('buildUrl', function () {
      it('should format dates properly', function () {
        var startAt = moment('2014-07-01T01:00:00Z').utc(),
            source = new DataSource({ 'query-params': {
              start_at: startAt
            }});

        expect(source.buildUrl()).toContain(
          encodeURIComponent(startAt.format(DataSource.ISO_8601)));
      });

      it('should deal with arrays', function () {
        var source = new DataSource({ 'query-params': {
              foo: 'bar1',
              bar: 'foo1'
            }});

        expect(source.buildUrl()).toContain('foo=bar1');
        expect(source.buildUrl()).toContain('bar=foo1');
      });

      it('should only add query string if there are any params', function () {
        var source = new DataSource({ 'query-params': {} });

        expect(source.buildUrl()).not.toContain('?');
      });

      it('merges parameters correctly', function () {
        var source = new DataSource({ 'query-params': {
              foo: 'bar'
            } });

        expect(source.buildUrl({ foo: 'foo' })).toContain('foo=foo');
      });

      it('should contain the data group and type', function () {
        var source = new DataSource({
              'data-group': 'foo',
              'data-type': 'bar'
            });

        source.backdropUrl = 'perf.service/{{ data-group }}/{{ data-type }}';

        expect(source.buildUrl()).toBe('perf.service/foo/bar');
      });

      describe('if flatten everything', function () {
        it('should contain the data group and type', function () {
          var source = new DataSource({
                'data-group': 'foo',
                'data-type': 'bar'
              }, { flattenEverything: true });

          source.backdropUrl = 'perf.service/{{ data-group }}/{{ data-type }}';

          expect(source.buildUrl()).toBe('perf.service/foo/bar?flatten=true');
        });
      });
    });

    describe('setQueryParams', function () {
      it('should fire a change event', function () {
        var source = new DataSource({
            'query-params': {
              foo: 'bar'
            }
          }),
          spy = jasmine.createSpy();

        source.once('change', spy);

        source.setQueryParam('foo', 'changed');

        expect(spy).toHaveBeenCalled();
        expect(source.buildUrl()).toContain('foo=changed');
      });

      it('accepts multiple properties as a hash', function () {
        var source = new DataSource({
            'query-params': {
              foo: 'bar'
            }
          }),
          spy = jasmine.createSpy();

        source.once('change', spy);

        source.setQueryParam({
          foo: 'changed',
          bar: 'baz'
        });

        expect(spy).toHaveBeenCalled();
        expect(source.buildUrl()).toContain('foo=changed');
        expect(source.buildUrl()).toContain('bar=baz');
      });

      it('should handle there being no query params object', function () {
        var source = new DataSource({});

        source.setQueryParam('foo', 'bar');

        expect(source.buildUrl()).toContain('foo=bar');
      });
    });

    describe('configureTimespans', function () {
      it('should add an end_at when start_at no duration', function () {
        var source = new DataSource(),
            withTimespan = source.configureTimespans({
              start_at: '2014-12-23T13:58:00Z'
            });

        expect(withTimespan.end_at).not.toBe(undefined);
      });

      it('should set a duration if period but no start/end', function () {
        var source = new DataSource(),
            withTimespan = source.configureTimespans({
              period: 'week'
            });

        expect(withTimespan.duration).toBe(DataSource.PERIOD_TO_DURATION['week']);
      });

      it('shouldnt alter params with a timespan set', function () {
        var source = new DataSource(),
            withTimespan = source.configureTimespans({
              period: 'week',
              start_at: '2014-12-15T00:00:00Z',
              end_at: '2014-12-22T00:00:00Z'
            });

        expect(withTimespan.duration).toBe(undefined);
      });

      it('removes duration if start_at and end_at are both set', function () {
        var source = new DataSource(),
            withTimespan = source.configureTimespans({
              period: 'week',
              start_at: '2014-12-15T00:00:00Z',
              end_at: '2014-12-22T00:00:00Z',
              duration: 20
            });

        expect(withTimespan.duration).toBe(undefined);
      });
    });
  });

});
