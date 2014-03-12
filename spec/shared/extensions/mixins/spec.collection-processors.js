define([
  'extensions/mixins/collection-processors',
  'backbone'
], function (Processors, Backbone) {

  describe('Collection processors', function () {

    describe('percentOfTotal', function () {

      it('returns a function', function () {
        var collection = new Backbone.Collection();
        expect(typeof Processors.percentOfTotal.call(collection, 'a')).toEqual('function');
      });

      it('calculates the percentage of the total for keys passed', function () {
        var collection = new Backbone.Collection([
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

  });

});
