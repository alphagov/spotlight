define([
  'common/collections/completion_numbers'
],
function (CompletionNumbersCollection) {
  describe('Completion numbers collection', function () {

    var collection;

    beforeEach(function () {
      collection = new CompletionNumbersCollection([], {
        denominatorMatcher: 'foo',
        numeratorMatcher: 'bar',
        valueAttr: '_end'
      });
    });

    describe('parse', function () {

      it('maps valueAttr to "uniqueEvents"', function () {
        var input = [
          { _end: 5 }
        ];
        var output = collection.parse({ data: input });
        expect(output[0]).toEqual({ _end: 5, uniqueEvents: 5 });
      });

      it('should add null if no end value', function () {
        var input = [
          { _end: null }
        ];
        var output = collection.parse({ data: input });
        expect(output[0]).toEqual({ _end: null, uniqueEvents: null });
      });

      it('should add a default value if end is null and one is provided', function () {
        collection.options.defaultValue = 0;
        var input = [
          { _end: null }
        ];
        var output = collection.parse({ data: input });
        expect(output[0]).toEqual({ _end: null, uniqueEvents: 0 });
      });

    });

  });
});
