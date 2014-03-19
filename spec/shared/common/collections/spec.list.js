define([
  'common/collections/list',
  'extensions/collections/collection'
],
function (ListCollection, Collection) {
  describe('ListCollection', function () {

    beforeEach(function () {
      jasmine.Clock.useMock();
      spyOn(ListCollection.prototype, 'fetch');
      spyOn(Collection.prototype, 'fetch');
    });

    describe('queryParams', function () {
      it('if sortBy and limit are passed as options they are applied', function () {
        var collection = new ListCollection(
          { 'data' : [] },
          {
            id: 'a',
            title: 'a',
            queryParams: {
              limit: 60,
              sort_by: '_timestamp:descending'
            }
          }
        );
        expect(collection.prop('queryParams').sort_by).toEqual('_timestamp:descending');
        expect(collection.prop('queryParams').limit).toEqual(60);
      });

      it('if sortBy and limit are passed as options they are applied', function () {
        var collection = new ListCollection(
          {
            data : []
          },
          {
            queryParams: {
              sort_by: '_timestamp:descending'
            },
            id: 'a',
            title: 'a'
          }
        );
        expect(collection.prop('queryParams').sort_by).toEqual('_timestamp:descending');
        expect(collection.prop('queryParams').limit).toBe(undefined);
      });

    });


    it('parses strings that look like numbers into numbers', function () {
      var collection = new ListCollection({
        'data': [
          {
            _timestamp: '2002-03-01T00:00:03+00:00',
            'unique_visitors': '100'
          },
          {
            _timestamp: '2002-03-01T00:00:00+00:00',
            'unique_visitors': '120'
          }
        ]
      }, {
        id: 'a',
        title: 'a',
        'parse': true
      });
      expect(collection.first().get('values').first().get('_timestamp').format()).toEqual('2002-03-01T00:00:00+00:00');
      expect(collection.first().get('values').first().get('unique_visitors')).toEqual(120);
      expect(collection.first().get('values').last().get('unique_visitors')).toEqual(100);
    });

    it('if updateInterval set, auto-updates on the client', function () {
      jasmine.clientOnly(function () {
        var collection = new ListCollection({}, {
          id: 'a',
          title: 'a',
          updateInterval: 120 * 1000
        });
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000 - 1);
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(1);
        expect(collection.fetch).toHaveBeenCalled();
      });
    });

    it('if updateInterval not set it does not auto-update on client', function () {
      jasmine.clientOnly(function () {
        var collection = new ListCollection({}, {id: 'a', title: 'a'});
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000 - 1);
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(1);
        expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    it('does not auto-update on the server', function () {
      jasmine.serverOnly(function () {
        var collection = new ListCollection({}, {
          id: 'a',
          title: 'a',
          updateInterval: 120 * 1000
        });
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000);
        expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    it('passes fetch options through when defined', function () {
      var collection = new ListCollection({}, {
        id: 'a',
        title: 'a',
        fetchOptions: {
          headers: {'cache-control': 'max-age=120'}
        }
      });

      collection.fetch.andCallThrough();
      collection.fetch();

      expect(Collection.prototype.fetch).toHaveBeenCalled();

      var args = Collection.prototype.fetch.argsForCall[0][0];
      expect(args).toEqual({
        headers: {'cache-control': 'max-age=120'}
      });
    });

    it('will throw an exception if id or title are missing from options', function () {
      function createWithOptions(options) {
        return function () {
          return new ListCollection({}, options);
        };
      }

      expect(createWithOptions()).toThrow();
      expect(createWithOptions({ title: 'foo' })).toThrow();
      expect(createWithOptions({ id: 'foo' })).toThrow();
      expect(createWithOptions({ id: '', title: '' })).toThrow();
      expect(createWithOptions({ id: 'foo', title: 'foo' })).not.toThrow();
    });

  });
});
