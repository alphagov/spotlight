define([
  'common/collections/multi_stats',
  'extensions/collections/matrix'
],
  function (MultiStatsCollection, MatrixCollection) {
  describe('MultiStatsCollection', function () {

    var stats;
    beforeEach(function () {
      stats = [
        {
          'title': 'Row A',
          'attr': 'a'
        },
        {
          'title': 'Row B',
          'attr': 'b',
          'format': '£{{ value }}'
        },
        {
          'title': 'Row C',
          'attr': 'c',
          'format': '{{ value }}%'
        }
      ];
    });

    it('parses data into the correct format', function () {
      var collection = new MultiStatsCollection({
          'data': [{
            _end_at: '2002-03-01T00:00:00+00:00',
            _start_at: '2002-02-01T00:00:00+00:00',
            a: [23661],
            b: [23661],
            c: [31]
          }]
        }, { 'parse': true, stats: stats, period: 'month' });

      expect(collection.first().get('values').at(0).get('_start_at').format()).toEqual('2002-02-01T00:00:00+00:00');
      expect(collection.first().get('values').at(0).get('a')).toEqual(23661);
      expect(collection.first().get('values').at(0).get('b')).toEqual(23661);
      expect(collection.first().get('values').at(0).get('c')).toEqual(31);
    });

    it('does not blow up when a requested attribute is not available', function () {
      var collection = new MultiStatsCollection({
          'data': [{
            _end_at: '2002-03-01T00:00:00+00:00',
            _start_at: '2002-02-01T00:00:00+00:00',
            a: [23661],
            c: [31]
          }]
        }, { 'parse': true, stats: stats, period: 'month' });

      expect(collection.first().get('values').at(0).get('_start_at').format()).toEqual('2002-02-01T00:00:00+00:00');
      expect(collection.first().get('values').at(0).get('a')).toEqual(23661);
      expect(collection.first().get('values').at(0).get('b')).not.toBeDefined();
      expect(collection.first().get('values').at(0).get('c')).toEqual(31);
    });

    it('trims to the latest date that has at least one stat available', function () {
      var collection = new MultiStatsCollection({
          'data': [
            {
              _end_at: '2002-03-01T00:00:00+00:00',
              _start_at: '2002-02-01T00:00:00+00:00',
              a: [23661],
              b: [23661],
              c: [31]
            },
            {
              _end_at: '2002-04-01T00:00:00+00:00',
              _start_at: '2002-03-01T00:00:00+00:00',
              a: [123],
              b: [],
              c: []
            },
            {
              _end_at: '2002-05-01T00:00:00+00:00',
              _start_at: '2002-04-01T00:00:00+00:00',
              a: [],
              b: [],
              c: []
            }
          ]
        }, { 'parse': true, stats: stats, period: 'month' });

      expect(collection.first().get('values').length).toEqual(2);
      expect(collection.first().get('values').at(0).get('_start_at').format()).toEqual('2002-02-01T00:00:00+00:00');
      expect(collection.first().get('values').at(0).get('_end_at').format()).toEqual('2002-03-01T00:00:00+00:00');
      expect(collection.first().get('values').at(0).get('a')).toEqual(23661);
      expect(collection.first().get('values').at(0).get('b')).toEqual(23661);
      expect(collection.first().get('values').at(0).get('c')).toEqual(31);
      expect(collection.first().get('values').at(1).get('_start_at').format()).toEqual('2002-03-01T00:00:00+00:00');
      expect(collection.first().get('values').at(1).get('a')).toEqual(123);
      expect(collection.first().get('values').at(1).get('b')).not.toBeDefined();
      expect(collection.first().get('values').at(1).get('c')).not.toBeDefined();
    });

    describe('getDataByTableFormat', function () {
      var collection;
      beforeEach(function () {
        spyOn(MatrixCollection.prototype, 'getDataByTableFormat');
        collection = new MultiStatsCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done'
        });
      });

      it('returns nothing', function () {
        collection.getDataByTableFormat();
        expect(collection.getDataByTableFormat()).toEqual(undefined);
        expect(MatrixCollection.prototype.getDataByTableFormat).not.toHaveBeenCalled();
      });
    });
  });
});
