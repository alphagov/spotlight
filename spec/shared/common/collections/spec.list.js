define([
  'common/collections/list',
  'extensions/collections/collection'
],
function (ListCollection, Collection) {
  describe("ListCollection", function () {

    beforeEach(function() {
      jasmine.Clock.useMock();
      spyOn(ListCollection.prototype, "fetch");
      spyOn(Collection.prototype, "fetch");
    });

    it("if sortBy and limit are passed as options they are applied", function () {
      var collection = new ListCollection(
        { 'data' : [] },
        { id: "a", title: "a",
          'limit': 60,
          'sortBy': "_timestamp:descending" }
      );
      var params = collection.queryParams();
      expect(params.sort_by).toEqual("_timestamp:descending");
      expect(params.limit).toEqual(60);
    });

    it("if neither sortBy and limit are passed as options there are no query params", function () {
      var collection = new ListCollection(
        { 'data' : [] },
        { id: "a", title: "a" }
      );
      expect(collection.queryParams()).toEqual({});
    });

    it("if sortBy and limit are passed as options they are applied", function () {
      var collection = new ListCollection(
        { 'data' : [] },
        { 'sortBy': "_timestamp:descending",
          id: "a", title: "a" }
      );
      var params = collection.queryParams();
      expect(params.sort_by).toEqual("_timestamp:descending");
      expect(params.limit).toBe(undefined);
    });

    it("parses strings that look like numbers into numbers", function () {
      var collection = new ListCollection({
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
      }, { 
        id: "a", title: "a",
        'parse': true 
      });
      expect(collection.first().get('values').first().get('_timestamp').format()).toEqual("2002-03-01T00:00:00+00:00");
      expect(collection.first().get('values').first().get('unique_visitors')).toEqual(120);
      expect(collection.first().get('values').last().get('unique_visitors')).toEqual(100);
    });

    it("if updateInterval set, auto-updates on the client", function () {
      jasmine.clientOnly(function () {
        var collection = new ListCollection({}, { 
          id: "a", title: "a",
          updateInterval: 120 * 1000
        });
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000 - 1);
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(1);
        expect(collection.fetch).toHaveBeenCalled();
      });
    });

    it("if updateInterval not set it does not auto-update on client", function () {
      jasmine.clientOnly(function () {
        var collection = new ListCollection({}, {id: "a", title: "a"});
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000 - 1);
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(1);
        expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    it("does not auto-update on the server", function () {
      jasmine.serverOnly(function () {
        var collection = new ListCollection({}, { 
          id: "a", title: "a",
          updateInterval: 120 * 1000 
        });
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000);
        expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    it("passes fetch options through when defined", function () {
      var collection = new ListCollection({}, { 
        id: "a", title: "a",
        fetchOptions: { 
          headers: {"cache-control": "max-age=120"}
        }
      });

      collection.fetch.andCallThrough();
      collection.fetch();

      expect(Collection.prototype.fetch).toHaveBeenCalled();

      var args = Collection.prototype.fetch.argsForCall[0][0];
      expect(args).toEqual({
        headers: {"cache-control": "max-age=120"}
      });
    });

    it("will throw an exception if id or title are missing from options", function () {
      function create_with_options(options) {
        return function () {
          new ListCollection({}, options);
        }
      }

      expect(create_with_options()).toThrow();
      expect(create_with_options({ title: 'foo' })).toThrow();
      expect(create_with_options({ id: 'foo' })).toThrow();
      expect(create_with_options({ id: '', title: '' })).toThrow();
      expect(create_with_options({ id: 'foo', title: 'foo' })).not.toThrow();
    });
  });
});
