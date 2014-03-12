define([
  'common/collections/journey',
  'extensions/collections/collection',
  'extensions/collections/matrix'
], function (JourneyCollection, Collection) {
  describe('JourneyCollection', function () {
    describe('getTableRows', function () {
      var collection;

      beforeEach(function () {
        collection = new JourneyCollection([{}]);
        collection.at(0).set('values', new Collection([
          { title: 'Start', b: 3 },
          { title: 'End', b: 1 }
        ]));
      });

      it('returns an array', function () {
        expect(_.isArray(collection.getTableRows('b'))).toEqual(true);
      });

      it('flattens the rows into columns of a single row', function () {
        var expected = [[3, 1]];

        expect(collection.getTableRows('b')).toEqual(expected);
      });
    });
  });
});
