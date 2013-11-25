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
