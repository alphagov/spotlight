define([
  'common/collections/completion_rate'
],
function (CompletionRateCollection) {
  describe("Completion rate collection", function () {
    it("should add completion rate to values", function () {
      var input = {
        _start: 10,
        _end: 5
      };
      var expected = {
        completion: 0.5
      }
      expect(CompletionRateCollection.prototype.defaultValueAttrs(input)).toEqual(expected)
    });

    it("should add null if no start value", function () {
      var input = {
        _start: 0,
        _end: 0
      };
      var expected = {
        completion: null
      }
      expect(CompletionRateCollection.prototype.defaultValueAttrs(input)).toEqual(expected)
    });

    it("should return default colletion attributes", function () {
      var input = {
        _start: 10,
        _end: 5,
        values: [ { get: function(){ return 1; } }, { get: function(){ return null; } } ]
      };
      var expected = {
        id: "completion",
        title: "Completion rate",
        totalCompletion: 0.5,
        weeks: { total: 2, available: 1 }
      };
      expect(CompletionRateCollection.prototype.defaultCollectionAttrs(input)).toEqual(expected);
    });

    it("should return null in default colletion attributes if no starts", function () {
      var input = {
        _start: 0,
        _end: 5,
        values: [ { get: function(){ return 1; } }, { get: function(){ return null; } } ]
      };
      var expected = {
        id: "completion",
        title: "Completion rate",
        totalCompletion: null,
        weeks: { total: 2, available: 1 }
      };
      expect(CompletionRateCollection.prototype.defaultCollectionAttrs(input)).toEqual(expected);
    });
  });
});
