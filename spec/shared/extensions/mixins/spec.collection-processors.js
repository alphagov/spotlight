define([
  'extensions/mixins/collection-processors',
  'extensions/collections/collection'
], function (Processors, Collection) {

  describe('Collection processors', function () {

    describe('percentOfTotal', function () {

      it('returns a function', function () {
        var collection = new Collection();
        expect(typeof Processors.percentOfTotal.call(collection, 'a')).toEqual('function');
      });

      it('calculates the percentage of the total for keys passed', function () {
        var collection = new Collection([
          { a: 1 },
          { a: 2 },
          { a: 3 },
          { a: 4 }
        ]);
        var fn = Processors.percentOfTotal.call(collection, 'a');
        expect(fn(1)).toEqual(0.1);
        expect(fn(2)).toEqual(0.2);
        expect(fn(3)).toEqual(0.3);
        expect(fn(4)).toEqual(0.4);
      });

    });

    describe('delta', function () {

      var collection;

      beforeEach(function () {

        collection = new Collection([
          {
            _timestamp: '2014-01-01T00:00:00Z',
            a: 21,
            values: [
              { a: 20 },
              { a: 21 }
            ]
          },
          {
            _timestamp: '2014-01-01T00:00:00Z',
            a: 22,
            values: [
              { a: 20 },
              { a: 22 }
            ]
          },
          {
            _timestamp: '2014-01-01T00:00:00Z',
            a: 18,
            values: [
              { a: 20 },
              { a: 18 }
            ]
          },
          {
            _timestamp: '2014-01-01T00:00:00Z',
            a: 24,
            values: [
              { a: 20 },
              { a: 24 }
            ]
          }
        ], {
          axes: {
            x: {
              key: 'a'
            }
          }
        });

      });

      it('returns a function', function () {
        expect(typeof Processors.delta.call(collection, 'a')).toEqual('function');
      });

      it('calculates the change from the previous value', function () {
        var fn = Processors.delta.call(collection, 'a');
        expect(fn(21, collection.at(0))).toEqual(0.05);
        expect(fn(22, collection.at(1))).toEqual(0.1);
        expect(fn(18, collection.at(2))).toEqual(-0.1);
        expect(fn(24, collection.at(3))).toEqual(0.2);
      });

    });

  });

});
