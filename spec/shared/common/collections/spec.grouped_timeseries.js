define([
  'common/collections/grouped_timeseries',
  'extensions/collections/collection',
  'extensions/models/query'
],
function (GroupedTimeseries, Collection, Query) {
  describe('GroupedTimeseries', function () {
    var response;

    var collection;
    beforeEach(function () {
      response = {
        'data': [
          {
            'some:value': 3,
            'values': [
              {
                '_end_at': '2012-09-01T00:00:00+00:00',
                'some:value': 3,
                '_start_at': '2012-08-01T00:00:00+00:00'
              },
              {
                '_end_at': '2012-10-01T00:00:00+00:00',
                'some:value': null,
                '_start_at': '2012-09-01T00:00:00+00:00'
              }
            ],
            'some-category': 'xyz'
          },
          {
            'some:value': 7,
            'values': [
              {
                '_end_at': '2012-09-01T00:00:00+00:00',
                'some:value': 3,
                '_start_at': '2012-08-01T00:00:00+00:00'
              },
              {
                '_end_at': '2012-10-01T00:00:00+00:00',
                'some:value': 6,
                '_start_at': '2012-09-01T00:00:00+00:00'
              }
            ],
            'some-category': 'abc'
          },
          {
            'some:value': 16,
            'values': [
              {
                '_end_at': '2012-09-01T00:00:00+00:00',
                'some:value': 6,
                '_start_at': '2012-08-01T00:00:00+00:00'
              },
              {
                '_end_at': '2012-10-01T00:00:00+00:00',
                'some:value': 10,
                '_start_at': '2012-09-01T00:00:00+00:00'
              }
            ],
            'some-category': 'def'
          }
        ]
      };
      collection = new GroupedTimeseries([], {
        'data-type': 'some-type',
        'data-group': 'some-group',
        valueAttr: 'some:value',
        category: 'some-category',
        period: 'month',
        startAt: '2014-01-10T00:00:00+00:00',
        endAt: '2014-03-10T00:00:00+00:00',
        axes: {
          x: {
            'label': 'Date',
            'key': '_start_at'
          },
          y: [
            {
              'label': 'ABC',
              'categoryId': 'abc'
            },
            {
              'label': 'DEF',
              'categoryId': 'def'
            },
            {
              'label': 'XYZ',
              'categoryId': 'xyz'
            }
          ]
        }
      });
      collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
    });

    it('should pass through duration to query generator which wont add it to the url', function () {
      spyOn(Query.prototype, 'set');
      var durationCollection = new GroupedTimeseries([], {
        'period': 'week',
        'duration': 60
      });
      var args = durationCollection.query.set.mostRecentCall.args;
      expect(durationCollection.query.set).toHaveBeenCalled();
      expect(args[0].duration).toEqual(60);
      expect(durationCollection.url()).not.toContain('duration');
    });

    it('should not add duration to url undefined', function () {
      var durationCollection = new GroupedTimeseries([], {'period': 'week'});
      expect(durationCollection.url()).not.toContain('duration');
    });

    describe('url', function () {
      /* global decodeURIComponent */
      it('should query backdrop with the correct url for the config', function () {
        expect(decodeURIComponent(collection.url())).toContain('some-group');
        expect(decodeURIComponent(collection.url())).toContain('some-type');
        expect(decodeURIComponent(collection.url())).toContain('period=month');
        expect(decodeURIComponent(collection.url())).toContain('start_at=2014-01-10T00:00:00+00:00');
        expect(decodeURIComponent(collection.url())).toContain('end_at=2014-03-10T00:00:00+00:00');
        expect(decodeURIComponent(collection.url())).toContain('group_by=some-category');
        expect(decodeURIComponent(collection.url())).toContain('collect=some:value');
        expect(decodeURIComponent(collection.url())).not.toContain('filter_by');
      });

      it('should contain filters', function () {
        var filteredCollection = new GroupedTimeseries([], {
          'data-type': 'some-type',
          'data-group': 'some-group',
          filterBy: ['filter_1:abc', 'filter_2:def']
        });
        filteredCollection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';

        expect(filteredCollection.url()).toContain('filter_by=filter_1%3Aabc');
        expect(filteredCollection.url()).toContain('filter_by=filter_2%3Adef');
      });
    });

    describe('parse', function () {

      it('collapses groups into single models', function () {
        var parsed = collection.parse(response);
        expect(parsed.length).toEqual(2);
      });

      it('adds total properties to models', function () {
        var parsed = collection.parse(response);
        expect(parsed[0]['total:some:value']).toEqual(12);
        expect(parsed[1]['total:some:value']).toEqual(16);
      });

      it('adds percent properties to models for each axis property', function () {
        var parsed = collection.parse(response);
        expect(parsed[0]['abc:some:value:percent']).toEqual(0.25);
        expect(parsed[0]['def:some:value:percent']).toEqual(0.5);
        expect(parsed[0]['xyz:some:value:percent']).toEqual(0.25);
        expect(parsed[1]['abc:some:value:percent']).toEqual(0.375);
        expect(parsed[1]['def:some:value:percent']).toEqual(0.625);
        expect(parsed[1]['xyz:some:value:percent']).toEqual(0);
      });

      it('copes if not all of the specified series are present in the response', function () {
        var collectionWithExtraSeries = new GroupedTimeseries([], {
          'data-type': 'some-type',
          'data-group': 'some-group',
          valueAttr: 'some:value',
          category: 'some-category',
          period: 'month',
          axes: {
            x: {
              'label': 'Date',
              'key': '_start_at'
            },
            y: [
              {
                'label': 'ABC',
                'categoryId': 'abc'
              },
              {
                'label': 'DEF',
                'categoryId': 'def'
              },
              {
                'label': 'XYZ',
                'categoryId': 'xyz'
              },
              {
                'label': 'GHI',
                'categoryId': 'ghi'
              }
            ]
          }
        });

        var parsed = collectionWithExtraSeries.parse(response);

        expect(parsed[0]['ghi:some:value']).toEqual(null);
        expect(parsed[1]['ghi:some:value']).toEqual(null);
        expect(parsed[0]['ghi:some:value:percent']).toEqual(0);
        expect(parsed[1]['ghi:some:value:percent']).toEqual(0);
      });

      it('copes if none of the specified series are present in the response', function () {
        var collectionWithExtraSeries = new GroupedTimeseries([], {
          'data-type': 'some-type',
          'data-group': 'some-group',
          valueAttr: 'some:value',
          category: 'some-category',
          period: 'month',
          axes: {
            x: {
              'label': 'Date',
              'key': '_start_at'
            },
            y: [
              {
                'label': 'GHI',
                'categoryId': 'ghi'
              }
            ]
          }
        });

        var parsed = collectionWithExtraSeries.parse(response);
        expect(parsed[0]['ghi:some:value']).toEqual(null);
        expect(parsed[1]['ghi:some:value']).toEqual(null);
        expect(parsed[0]['total:some:value']).toEqual(null);
        expect(parsed[1]['total:some:value']).toEqual(null);
        expect(parsed[0]['ghi:some:value:percent']).toEqual(null);
        expect(parsed[1]['ghi:some:value:percent']).toEqual(null);
      });

      it('groups categories together if mappings are provided', function () {
        collection.options.groupMapping = {
          def: 'abc'
        };
        collection.options.axes.y = [
          {
            'label': 'ABC',
            'categoryId': 'abc'
          },
          {
            'label': 'XYZ',
            'categoryId': 'xyz'
          }
        ];

        var parsed = collection.parse(response);
        expect(parsed[0]['abc:some:value']).toEqual(9);
        expect(parsed[1]['abc:some:value']).toEqual(16);
        expect(parsed[0]['abc:some:value:percent']).toEqual(0.75);
        expect(parsed[1]['abc:some:value:percent']).toEqual(1);

        expect(parsed[0]['def:some:value']).toBeUndefined();
        expect(parsed[1]['def:some:value']).toBeUndefined();
        expect(parsed[0]['def:some:value:percent']).toBeUndefined();
        expect(parsed[1]['def:some:value:percent']).toBeUndefined();

        expect(parsed[0]['total:some:value']).toEqual(12);
        expect(parsed[1]['total:some:value']).toEqual(16);

      });

    });

  });
});
