define([
  'common/collections/visitors-realtime',
  'extensions/collections/collection'
],
function (VisitorsRealtimeCollection, Collection) {
  describe("VisitorsRealtimeCollection", function () {

    beforeEach(function() {
      jasmine.Clock.useMock();
      spyOn(VisitorsRealtimeCollection.prototype, "fetch");
      spyOn(Collection.prototype, "fetch");
    });

    it("is created with the correct query parameters", function () {
      var collection = new VisitorsRealtimeCollection(
        { 'data' : [] },
        { 'numTwoMinPeriodsToQuery': 60 }
      );
      var params = collection.queryParams();
      expect(params.sort_by).toEqual("_timestamp:descending");
      expect(params.limit).toEqual(60);
    });

    it("parses string data into float format", function () {
      var collection = new VisitorsRealtimeCollection({
          'data': [
            {
              _timestamp: "2002-03-01T00:00:03+00:00",
              unique_visitors: '100'
            },
            {
              _timestamp: "2002-03-01T00:00:00+00:00",
              unique_visitors: '120'
            }
          ]
      }, { 'parse': true } );
      expect(collection.first().get('values').first().get('_timestamp').format()).toEqual("2002-03-01T00:00:00+00:00");
      expect(collection.first().get('values').first().get('unique_visitors')).toEqual(120);
      expect(collection.first().get('values').last().get('unique_visitors')).toEqual(100);
    });

    it("auto-updates on the client", function () {
      jasmine.clientOnly(function () {
        var collection = new VisitorsRealtimeCollection();
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000 - 1);
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(1);
        expect(collection.fetch).toHaveBeenCalled();
      });
    });

    it("does not auto-update on the server", function () {
      jasmine.serverOnly(function () {
        var collection = new VisitorsRealtimeCollection();
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000);
        expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    it("sets cache headers correctly", function () {
      var collection = new VisitorsRealtimeCollection();
      collection.fetch.andCallThrough();
      collection.fetch();
      expect(Collection.prototype.fetch).toHaveBeenCalled();
      var args = Collection.prototype.fetch.argsForCall[0][0];
      expect(args).toEqual({
        headers: {"cache-control": "max-age=120"}
      });
    });
  });
});
