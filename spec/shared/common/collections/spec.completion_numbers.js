define([
  'common/collections/completion_numbers'
],
function (CompletionNumbersCollection) {
  describe('Completion numbers collection', function () {

    var collection;

    beforeEach(function () {
      collection = new CompletionNumbersCollection([], {
        denominatorMatcher: 'foo',
        numeratorMatcher: 'bar'
      });
    });

    describe('defaultValueAttrs', function () {

      it('should add unique events to values', function () {
        var input = {
          _end: 5
        };
        var expected = {
          uniqueEvents: 5
        };
        expect(collection.defaultValueAttrs(input)).toEqual(expected);
      });

      it('should add null if no end value', function () {
        var input = {
          _end: null
        };
        var expected = {
          uniqueEvents: null
        };
        expect(collection.defaultValueAttrs(input)).toEqual(expected);
      });

      it('should add a default value if end is null and one is provided', function () {
        collection = new CompletionNumbersCollection([], {
          defaultValue: 0,
          denominatorMatcher: 'foo',
          numeratorMatcher: 'bar'
        });
        var input = {
          _end: null
        };
        var expected = {
          uniqueEvents: 0
        };
        expect(collection.defaultValueAttrs(input)).toEqual(expected);
      });

      it('should return default collection attributes', function () {
        var input = {
          _start: 10,
          _end: 5,
          values: [ {get: function () { return 1; }}, {get: function () { return null; }} ]
        };
        var expected = {
          id: 'done',
          title: 'Done',
          mean: 5,
          periods: { total: 2, available: 1 }
        };
        expect(collection.defaultCollectionAttrs(input)).toEqual(expected);
      });

      it('should return null mean in default collection attributes no events', function () {
        var input = {
          _start: 10,
          _end: 5,
          values: [ {get: function () { return null; }}, {get: function () { return null; }} ]
        };
        var expected = {
          id: 'done',
          title: 'Done',
          mean: null,
          periods: { total: 2, available: 0 }
        };
        expect(collection.defaultCollectionAttrs(input)).toEqual(expected);
      });

    });

  });
});
