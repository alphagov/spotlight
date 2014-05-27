define([
  'common/collections/grouped_timeseries',
  'extensions/collections/collection',
  'extensions/collections/matrix',
  'extensions/models/query'
],
function (GroupedTimeseries, Collection, MatrixCollection, Query) {
  describe('GroupedTimeseries', function () {
    var response = {
      'data': [
        {
          'some:value': 5,
          'values': [
            {
              '_end_at': '2012-09-01T00:00:00+00:00',
              'some:value': 3,
              '_start_at': '2012-08-01T00:00:00+00:00'
            },
            {
              '_end_at': '2012-10-01T00:00:00+00:00',
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
              'some:value': 4,
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

    var expected = [
      {
        'id': 'abc',
        'title': 'ABC',
        'values': [
          {
            '_end_at': '2012-09-01T00:00:00+00:00',
            'some:value': 3,
            '_start_at': '2012-08-01T00:00:00+00:00'
          },
          {
            '_end_at': '2012-10-01T00:00:00+00:00',
            'some:value': 4,
            '_start_at': '2012-09-01T00:00:00+00:00'
          }
        ]
      },
      {
        'id': 'def',
        'title': 'DEF',
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
        ]
      },
      {
        'id': 'xyz',
        'title': 'XYZ',
        'values': [
          {
            '_end_at': '2012-09-01T00:00:00+00:00',
            'some:value': 3,
            '_start_at': '2012-08-01T00:00:00+00:00'
          },
          {
            '_end_at': '2012-10-01T00:00:00+00:00',
            '_start_at': '2012-09-01T00:00:00+00:00'
          }
        ]
      }
    ];

    var totalSeries = [
      {
        'id': 'Total',
        'title': 'Total',
        'values': [
          {
            '_start_at': '2012-08-01T00:00:00+00:00',
            '_end_at': '2012-09-01T00:00:00+00:00',
            'some:value': 12
          },
          {
            '_start_at': '2012-09-01T00:00:00+00:00',
            '_end_at': '2012-10-01T00:00:00+00:00',
            'some:value': 14
          }
        ]
      }
    ];
    var expectedWithTotal = totalSeries.concat(expected);
    var expectedWithPercentages = [
      {
        'id': 'abc',
        'title': 'ABC',
        'values': [
          {
            '_end_at': '2012-09-01T00:00:00+00:00',
            'some:value': 0.25,
            '_start_at': '2012-08-01T00:00:00+00:00',
            'some:value_original': 3
          },
          {
            '_end_at': '2012-10-01T00:00:00+00:00',
            'some:value': 0.2857142857142857,
            '_start_at': '2012-09-01T00:00:00+00:00',
            'some:value_original': 4,
          }
        ]
      },
      {
        'id': 'def',
        'title': 'DEF',
        'values': [
          {
            '_end_at': '2012-09-01T00:00:00+00:00',
            'some:value': 0.5,
            '_start_at': '2012-08-01T00:00:00+00:00',
            'some:value_original': 6
          },
          {
            '_end_at': '2012-10-01T00:00:00+00:00',
            'some:value': 0.7142857142857143,
            '_start_at': '2012-09-01T00:00:00+00:00',
            'some:value_original': 10
          }
        ]
      },
      {
        'id': 'xyz',
        'title': 'XYZ',
        'values': [
          {
            '_end_at': '2012-09-01T00:00:00+00:00',
            'some:value': 0.25,
            '_start_at': '2012-08-01T00:00:00+00:00',
            'some:value_original': 3
          },
          {
            '_end_at': '2012-10-01T00:00:00+00:00',
            '_start_at': '2012-09-01T00:00:00+00:00',
            'some:value': null,
          }
        ]
      }
    ];

    var collection;
    beforeEach(function () {
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
              'categoryId': 'abc',
              'key': 'value:sum'
            },
            {
              'label': 'DEF',
              'categoryId': 'def',
              'key': 'value:sum'
            },
            {
              'label': 'XYZ',
              'categoryId': 'xyz',
              'key': 'value:sum'
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
      it('parses the response', function () {
        var parsed = collection.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expected));
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
                'categoryId': 'abc',
                'key': 'value:sum'
              },
              {
                'label': 'DEF',
                'categoryId': 'def',
                'key': 'value:sum'
              },
              {
                'label': 'XYZ',
                'categoryId': 'xyz',
                'key': 'value:sum'
              },
              {
                'label': 'GHI',
                'categoryId': 'ghi',
                'key': 'value:sum'
              }
            ]
          }
        });

        var parsed = collectionWithExtraSeries.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expected));
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
                'categoryId': 'ghi',
                'key': 'value:sum'
              }
            ]
          }
        });

        var parsed = collectionWithExtraSeries.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify([]));
      });

      it('calculates total lines if specified', function () {
        var totalCollection = new GroupedTimeseries([], {
          'data-type': 'some-type',
          'data-group': 'some-group',
          valueAttr: 'some:value',
          category: 'some-category',
          period: 'month',
          axes: {
            x: {
              label: 'Date',
              key: '_start_at'
            },
            y: [
              {
                label: 'Total',
                categoryId: 'Total'
              },
              {
                label: 'ABC',
                categoryId: 'abc',
                key: 'value:sum'
              },
              {
                label: 'DEF',
                categoryId: 'def',
                key: 'value:sum'
              },
              {
                label: 'XYZ',
                categoryId: 'xyz',
                key: 'value:sum'
              }
            ]
          },
          'show-total-lines': true
        });
        totalCollection.options.showTotalLines = true;

        var parsed = totalCollection.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expectedWithTotal));

      });

      it('groups categories together if mappings are provided', function () {
        collection.options.groupMapping = {
          def: 'abc'
        };

        var output = collection.parse(response);

        expect(output.length).toEqual(2);

        expect(output[0]).toEqual({
          'id': 'abc',
          'title': 'ABC',
          'values': [
            {
              '_end_at': '2012-09-01T00:00:00+00:00',
              'some:value': 9,
              '_start_at': '2012-08-01T00:00:00+00:00'
            },
            {
              '_end_at': '2012-10-01T00:00:00+00:00',
              'some:value': 14,
              '_start_at': '2012-09-01T00:00:00+00:00'
            }
          ]
        });
        expect(output[1]).toEqual({
          'id': 'xyz',
          'title': 'XYZ',
          'values': [
            {
              '_end_at': '2012-09-01T00:00:00+00:00',
              'some:value': 3,
              '_start_at': '2012-08-01T00:00:00+00:00'
            },
            {
              '_end_at': '2012-10-01T00:00:00+00:00',
              '_start_at': '2012-09-01T00:00:00+00:00'
            }
          ]
        });
      });

      it('calculates percentages if specified', function () {
        var totalCollection = new GroupedTimeseries([], {
          'data-type': 'some-type',
          'data-group': 'some-group',
          valueAttr: 'some:value',
          category: 'some-category',
          period: 'month',
          axes: {
            x: {
              label: 'Date',
              key: '_start_at'
            },
            y: [
              {
                label: 'ABC',
                categoryId: 'abc',
                key: 'value:sum'
              },
              {
                label: 'DEF',
                categoryId: 'def',
                key: 'value:sum'
              },
              {
                label: 'XYZ',
                categoryId: 'xyz',
                key: 'value:sum'
              }
            ]
          },
          'use_stack': false,
          'one-hundred-percent': true
        });
        totalCollection.options.isOneHundredPercent = true;
        totalCollection.options.useStack = false;

        var parsed = totalCollection.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expectedWithPercentages));

      });

    });

  });
});
