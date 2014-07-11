define([
  'common/collections/grouped_timeseries'
],
function (GroupedTimeseries) {
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
        dataSource: {
          'data-type': 'some-type',
          'data-group': 'some-group',
          'query-params': {
            period: 'month',
            start_at: '2014-01-10T00:00:00+00:00',
            end_at: '2014-03-10T00:00:00+00:00',
            collect: 'some:value',
            group_by: 'some-category'
          }
        },
        valueAttr: 'some:value',
        category: 'some-category',
        axes: {
          x: {
            'label': 'Date',
            'key': '_start_at'
          },
          y: [
            {
              'label': 'ABC',
              'groupId': 'abc'
            },
            {
              'label': 'DEF',
              'groupId': 'def'
            },
            {
              'label': 'XYZ',
              'groupId': 'xyz'
            }
          ]
        }
      });
      collection.dataSource.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
    });

    describe('parse', function () {

      it('collapses groups into single models', function () {
        var parsed = collection.parse(response);
        expect(parsed.length).toEqual(2);
        expect(parsed[0]['abc:some:value']).toEqual(3);
        expect(parsed[1]['abc:some:value']).toEqual(6);
        expect(parsed[0]['def:some:value']).toEqual(6);
        expect(parsed[1]['def:some:value']).toEqual(10);
        expect(parsed[0]['xyz:some:value']).toEqual(3);
        expect(parsed[1]['xyz:some:value']).toEqual(null);
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
          dataSource: {
            'data-type': 'some-type',
            'data-group': 'some-group',
            'query-params': {
              period: 'month',
              group_by: 'some-category'
            }
          },
          valueAttr: 'some:value',
          category: 'some-category',
          axes: {
            x: {
              'label': 'Date',
              'key': '_start_at'
            },
            y: [
              {
                'label': 'ABC',
                'groupId': 'abc'
              },
              {
                'label': 'DEF',
                'groupId': 'def'
              },
              {
                'label': 'XYZ',
                'groupId': 'xyz'
              },
              {
                'label': 'GHI',
                'groupId': 'ghi'
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
                'groupId': 'ghi'
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
            'groupId': 'abc'
          },
          {
            'label': 'XYZ',
            'groupId': 'xyz'
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

      it('handles group key not existing', function () {
        collection.options.groupMapping = {
          def: 'zxc'
        };
        collection.options.axes.y = [
          {
            'label': 'ABC',
            'groupId': 'zxc'
          },
          {
            'label': 'XYZ',
            'groupId': 'xyz'
          }
        ];

        var parsed = collection.parse(response);
        expect(parsed[0]['zxc:some:value']).toEqual(6);
        expect(parsed[1]['zxc:some:value']).toEqual(10);
        expect(parsed[0]['zxc:some:value:percent']).toEqual(2/3);
        expect(parsed[1]['zxc:some:value:percent']).toEqual(1);

        expect(parsed[0]['total:some:value']).toEqual(9);
        expect(parsed[1]['total:some:value']).toEqual(10);

      });

    });

  });
});
