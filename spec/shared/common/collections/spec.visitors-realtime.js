define([
  'common/collections/visitors-realtime',
  'extensions/collections/collection',
  'extensions/collections/matrix'
],
function (VisitorsRealtimeCollection, Collection, MatrixCollection) {
  describe('VisitorsRealtimeCollection', function () {

    beforeEach(function () {
      jasmine.Clock.useMock();
      spyOn(VisitorsRealtimeCollection.prototype, 'fetch');
      spyOn(Collection.prototype, 'fetch');
    });

    it('is created with the correct query parameters', function () {
      var collection = new VisitorsRealtimeCollection(
        { 'data' : [] },
        { 'numTwoMinPeriodsToQuery': 60 }
      );
      var params = collection.queryParams();
      expect(params.sort_by).toEqual('_timestamp:descending');
      expect(params.limit).toEqual(60);
    });

    it('parses string data into float format', function () {
      var collection = new VisitorsRealtimeCollection({
          'data': [
            {
              _timestamp: '2002-03-01T00:00:03+00:00',
              unique_visitors: '100'
            },
            {
              _timestamp: '2002-03-01T00:00:00+00:00',
              unique_visitors: '120'
            }
          ]
      }, { 'parse': true });
      expect(collection.first().get('values').first().get('_timestamp').format()).toEqual('2002-03-01T00:00:00+00:00');
      expect(collection.first().get('values').first().get('unique_visitors')).toEqual(120);
      expect(collection.first().get('values').last().get('unique_visitors')).toEqual(100);
    });

    it('auto-updates on the client', function () {
      jasmine.clientOnly(function () {
        var collection = new VisitorsRealtimeCollection();
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000 - 1);
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(1);
        expect(collection.fetch).toHaveBeenCalled();
      });
    });

    it('does not auto-update on the server', function () {
      jasmine.serverOnly(function () {
        var collection = new VisitorsRealtimeCollection();
        expect(collection.fetch).not.toHaveBeenCalled();
        jasmine.Clock.tick(120 * 1000);
        expect(collection.fetch).not.toHaveBeenCalled();
      });
    });

    it('sets cache headers correctly', function () {
      var collection = new VisitorsRealtimeCollection();
      collection.fetch.andCallThrough();
      collection.fetch();
      expect(Collection.prototype.fetch).toHaveBeenCalled();
      var args = Collection.prototype.fetch.argsForCall[0][0];
      expect(args).toEqual({
        headers: {'cache-control': 'max-age=120'}
      });
    });

    describe('getDataByTableFormat', function () {
      var collection;
      beforeEach(function () {
        spyOn(MatrixCollection.prototype, 'getDataByTableFormat');
        collection = new VisitorsRealtimeCollection([{}]);
        collection.options.axisLabels = {
          'x': {
            'label': 'Date of transaction',
            'key': 'a'
          },
          'y': {
            'label': 'Number of visitors',
            'key': 'b'
          }
        };
        collection.at(0).set('values', new Collection([
          { a: '2012-08-01T00:00:00+00:00', b: 2 },
          { a: '2014-01-30T11:32:02+00:00', b: 4 }
        ]));
      });

      it('calls the MatrixCollection getDataByTableFormat if no axis data is set', function () {
        delete collection.options.axisLabels;
        collection.getDataByTableFormat();
        expect(MatrixCollection.prototype.getDataByTableFormat).toHaveBeenCalled();
      });

      it('will not call the MatrixCollection if axis is set', function () {
        collection.getDataByTableFormat();
        expect(MatrixCollection.prototype.getDataByTableFormat).not.toHaveBeenCalled();
      });

      it('returns an array', function () {
        expect(_.isArray(collection.getDataByTableFormat())).toEqual(true);
      });

      it('sorts the array by tabular format with the correct timestamp format', function () {
        var expected = [['Date of transaction', 'Number of visitors'], ['12:00:00 am', 2], ['11:32:02 am', 4]];

        expect(collection.getDataByTableFormat()).toEqual(expected);
      });
    });
  });
});
