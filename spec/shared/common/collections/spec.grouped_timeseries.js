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

    var collection;
    beforeEach(function (){
      collection = new GroupedTimeseries([], {
        'data-type': 'some-type',
        'data-group': 'some-group',
        valueAttr: 'some:value',
        category: 'some-category',
        period: 'month',
        seriesList: [
          { id: 'abc', title: 'ABC' },
          { id: 'def', title: 'DEF' },
          { id: 'xyz', title: 'XYZ' }
        ]
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
      it('should query backdrop with the correct url for the config', function () {
        expect(collection.url()).toContain('some-group');
        expect(collection.url()).toContain('some-type');
        expect(collection.url()).toContain('period=month');
        expect(collection.url()).toContain('group_by=some-category');
        expect(collection.url()).toContain('collect=some%3Avalue');
        expect(collection.url()).not.toContain('filter_by');
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
          seriesList: [
            { id: 'abc', title: 'ABC' },
            { id: 'def', title: 'DEF' },
            { id: 'xyz', title: 'XYZ' },
            { id: 'ghi', title: 'GHI' }
          ]
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
          seriesList: [
            { id: 'ghi', title: 'GHI' }
          ]
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
          seriesList: [
            { id: 'Total', title: 'Total' },
            { id: 'abc', title: 'ABC' },
            { id: 'def', title: 'DEF' },
            { id: 'xyz', title: 'XYZ' }
          ],
          'show-total-lines': true
        });
        totalCollection.options.showTotalLines = true;

        var parsed = totalCollection.parse(response);
        expect(JSON.stringify(parsed)).toEqual(JSON.stringify(expectedWithTotal));

      });
    });

    describe('getDataByTableFormat', function () {
      var collection;
      beforeEach(function () {
        spyOn(MatrixCollection.prototype, 'getDataByTableFormat');
        collection = new GroupedTimeseries([{}, {}]);
        collection.options.axisLabels = {
          'x': {
            'label': 'Date of transaction',
            'key': 'a'
          },
          'y': {
            'label': 'Number of residential transactions',
            'key': 'b'
          }
        };
        collection.options.period = 'month';
        collection.options.seriesList = [{
          'title': 'col a title'
        }, {
          'title': 'col b title'
        }];
        collection.at(0).set('values', new Collection([
          { a: '2012-08-01T00:00:00+00:00', b: 2 },
          { a: '2012-09-01T00:00:00+00:00', b: 4 }
        ]));
        collection.at(1).set('values', new Collection([
          { a: '2012-08-01T00:00:00+00:00', b: 6 },
          { a: '2012-09-01T00:00:00+00:00', b: null }
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

      it('sorts the array by tabular format', function () {
        var expected = [['Date of transaction (month)', 'col a title', 'col b title'], ['August 2012', 2, 6], ['September 2012', 4, null]];

        expect(collection.getDataByTableFormat()).toEqual(expected);
      });
    });

  });
});
