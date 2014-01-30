define([
  'common/collections/completion_numbers'
],
function (CompletionNumbersCollection) {
  describe("Completion numbers collection", function () {
    it("should add unique events to values", function () {
      var input = {
        _end: 5
      };
      var expected = {
        uniqueEvents: 5
      }
      expect(CompletionNumbersCollection.prototype.defaultValueAttrs(input)).toEqual(expected)
    });

    it("should add null if no end value", function () {
      var input = {
        _end: null
      };
      var expected = {
        uniqueEvents: null
      }
      expect(CompletionNumbersCollection.prototype.defaultValueAttrs(input)).toEqual(expected)
    });

    it("should return default collection attributes", function () {
      var input = {
        _start: 10,
        _end: 5,
        values: [ {get: function(){ return 1; }}, {get: function(){ return null; }} ]
      };
      var expected = {
        id: "done",
        title: "Done",
        mean: 5,
        weeks: { total: 2, available: 1 }
      };
      expect(CompletionNumbersCollection.prototype.defaultCollectionAttrs(input)).toEqual(expected);
    });

    it("should return null mean in default collection attributes no events", function () {
      var input = {
        _start: 10,
        _end: 5,
        values: [ {get: function(){ return null; }}, {get: function(){ return null; }} ]
      };
      var expected = {
        id: "done",
        title: "Done",
        mean: null,
        weeks: { total: 2, available: 0 }
      };
      expect(CompletionNumbersCollection.prototype.defaultCollectionAttrs(input)).toEqual(expected);
    });
  });
});
