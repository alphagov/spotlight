define([
  'common/collections/grouped_timeshift',
  'extensions/models/query'
],
function (GroupedTimeshiftCollection, Query) {
  xdescribe('GroupedTimeshiftCollection', function () {
    var weekDuration = Query.prototype.periods.week.duration;

    it('should return query parameters', function () {
      var collection = new GroupedTimeshiftCollection([], {
        valueAttr: 'value',
        period: 'week',
        category: 'group',
        axes: {
          x: {
            'label': 'Date',
            'key': '_start_at'
          },
          y: [
            {
              'label': 'One',
              'categoryId': 'one',
              'key': 'value:sum',
              'timeshift': 1
            }
          ]
        }
      });

      var queryParams = collection.queryParams();

      expect(queryParams.collect).toBe('value');
      expect(queryParams.period).toBe('week');
      expect(queryParams.group_by).toBe('group');
      expect(queryParams.duration).toBe(weekDuration + 1); // standard duration plus timeshift for a week graph
    });

    it('should offset the start_at param by the timeshift', function () {
      var collection = new GroupedTimeshiftCollection([], {
        valueAttr: 'value',
        period: 'week',
        category: 'group',
        startAt: '2014-04-02T00:00:00',
        axes: {
          x: {
            'label': 'Date',
            'key': '_start_at'
          },
          y: [
            {
              'label': 'One',
              'categoryId': 'one',
              'key': 'value:sum',
              'timeshift': 1
            }
          ]
        }
      });

      var queryParams = collection.queryParams();

      expect(queryParams.start_at).toBe('2014-03-26T00:00:00');
      expect(queryParams.duration).toBe(weekDuration);
    });

    it('should calculate duration', function () {
      var collection = new GroupedTimeshiftCollection([], {
        period: 'week'
      });

      expect(collection.duration()).toBe(weekDuration);
    });

    it('should allow for a custom duration', function () {
      var collection = new GroupedTimeshiftCollection([], {
        period: 'week',
        duration: 29
      });

      expect(collection.duration()).toBe(29);
    });

    it('should work out the duration of a graph based on a maximum timeshift', function () {
      var collection = new GroupedTimeshiftCollection([], {
        period: 'week',
        axes: {
          x: {
            'label': 'Date',
            'key': '_start_at'
          },
          y: [
            {
              'label': 'One',
              'categoryId': 'one',
              'key': 'value:sum',
              'timeshift': 4
            },
            {
              'label': 'Two',
              'categoryId': 'two',
              'key': 'value:sum',
              'timeshift': 5
            },
            {
              'label': 'Thr',
              'categoryId': 'thr',
              'key': 'value:sum',
              'timeshift': 6
            }
          ]
        }
      });

      expect(collection.duration()).toBe(weekDuration + 6);
    });

    it('should apply standard dates to a set of values', function () {
      var collection = new GroupedTimeshiftCollection([], {
        period: 'week',
        duration: 2
      });
      var seriesList = [
        { values: [
          { _start_at: '2014-01-01T00:00:00', _end_at: '2014-01-08T00:00:00' },
          { _start_at: '2014-01-08T00:00:00', _end_at: '2014-01-15T00:00:00' }
        ], timeshift: 2 },
        { values: [
          { _start_at: '2013-01-01T00:00:00', _end_at: '2013-01-08T00:00:00' },
          { _start_at: '2013-01-08T00:00:00', _end_at: '2013-01-15T00:00:00' }
        ], timeshift: 4 },
      ];
      var expectedList = [
        { values: [
            { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00',
              _original_start_at: '2014-01-01T00:00:00', _original_end_at: '2014-01-08T00:00:00' },
            { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00',
              _original_start_at: '2014-01-08T00:00:00', _original_end_at: '2014-01-15T00:00:00' }
          ], timeshift: 2 },
          { values: [
            { _start_at: '2013-01-29T00:00:00', _end_at: '2013-02-05T00:00:00',
              _original_start_at: '2013-01-01T00:00:00', _original_end_at: '2013-01-08T00:00:00' },
            { _start_at: '2013-02-05T00:00:00', _end_at: '2013-02-12T00:00:00',
              _original_start_at: '2013-01-08T00:00:00', _original_end_at: '2013-01-15T00:00:00' }
          ], timeshift: 4 },
        ];
      var output = collection.applyStandardDates(seriesList);
      _.each(output, function (series, i) {
        _.each(series.values, function (dataPoint, j) {
          expect(dataPoint).toEqual(expectedList[i].values[j]);
        });
      });
      expect(output).toEqual(expectedList);

    });

    it('should fill in missing values to match the duration', function () {
      var collection = new GroupedTimeshiftCollection([], {
        period: 'week',
        duration: 4,
        valueAttr: 'value'
      });
      var seriesList = [
        { values: [
          { _start_at: '2014-01-01T00:00:00', _end_at: '2014-01-08T00:00:00', value: 1 },
          { _start_at: '2014-01-08T00:00:00', _end_at: '2014-01-15T00:00:00', value: 1 }
        ] },
        { values: [
          { _start_at: '2013-01-01T00:00:00', _end_at: '2013-01-08T00:00:00', value: 1 },
          { _start_at: '2013-01-08T00:00:00', _end_at: '2013-01-15T00:00:00', value: 1 }
        ] },
      ];
      var expectedList = [
        { values: [
            { _start_at: '2014-01-01T00:00:00', _end_at: '2014-01-08T00:00:00', value: 1 },
            { _start_at: '2014-01-08T00:00:00', _end_at: '2014-01-15T00:00:00', value: 1 },
            { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00', value: null },
            { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00', value: null }
          ] },
          { values: [
            { _start_at: '2013-01-01T00:00:00', _end_at: '2013-01-08T00:00:00', value: 1 },
            { _start_at: '2013-01-08T00:00:00', _end_at: '2013-01-15T00:00:00', value: 1 },
            { _start_at: '2013-01-15T00:00:00', _end_at: '2013-01-22T00:00:00', value: null },
            { _start_at: '2013-01-22T00:00:00', _end_at: '2013-01-29T00:00:00', value: null }
          ] },
        ];
      var output = collection.applyStandardDates(seriesList);
      _.each(output, function (series, i) {
        _.each(series.values, function (dataPoint, j) {
          expect(dataPoint).toEqual(expectedList[i].values[j]);
        });
      });
      expect(output).toEqual(expectedList);
    });

    describe('parse', function () {

      var response, expected;
      beforeEach(function () {
          response = {
            data: [
              {
                key: 'one',
                values: [
                  { _start_at: '2014-01-01T00:00:00', _end_at: '2014-01-08T00:00:00', value: 1 },
                  { _start_at: '2014-01-08T00:00:00', _end_at: '2014-01-15T00:00:00', value: 2 },
                  { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00', value: 3 },
                  { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00', value: 4 }
                ]
              },
              {
                key: 'two',
                values: [
                  { _start_at: '2014-01-01T00:00:00', _end_at: '2014-01-08T00:00:00', value: 5 },
                  { _start_at: '2014-01-08T00:00:00', _end_at: '2014-01-15T00:00:00', value: 6 },
                  { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00', value: 7 },
                  { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00', value: 8 }
                ]
              }
            ]
          };

          expected = [{
            id: 'one',
            title: 'One',
            values: [
              { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00', value: 3 },
              { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00', value: 4 }
            ]
          }, {
            id: 'one2',
            title: 'One',
            timeshift: 2,
            values: [
              { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00', _original_start_at: '2014-01-01T00:00:00', _original_end_at: '2014-01-08T00:00:00', value: 1 },
              { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00', _original_start_at: '2014-01-08T00:00:00', _original_end_at: '2014-01-15T00:00:00', value: 2 },
            ]
          }, {
            id: 'two',
            title: 'Two',
            values: [
              { _start_at: '2014-01-15T00:00:00', _end_at: '2014-01-22T00:00:00', value: 7 },
              { _start_at: '2014-01-22T00:00:00', _end_at: '2014-01-29T00:00:00', value: 8 }
            ]
          }];
        });


      it('should parse response data', function () {

        var collection = new GroupedTimeshiftCollection([], {
          valueAttr: 'value',
          period: 'week',
          category: 'key',
          duration: 2,
          axes: {
            x: {
              'label': 'Date',
              'key': '_start_at'
            },
            y: [
              {
                'label': 'One',
                'categoryId': 'one',
                'key': 'value:sum',
              },
              {
                'label': 'One',
                'categoryId': 'one',
                'key': 'value:sum',
                'timeshift': 2
              },
              {
                'label': 'Two',
                'categoryId': 'two',
                'key': 'value:sum',
              }
            ]
          }
        });

        var parsed = collection.parse(response);
        expect(parsed.length).toBe(3);
        expect(parsed).toEqual(expected);
      });

      it('should cope if not all of the specified series are present in the response', function () {

        var collection = new GroupedTimeshiftCollection([], {
          valueAttr: 'value',
          period: 'week',
          category: 'key',
          duration: 2,
          axes: {
            x: {
              'label': 'Date',
              'key': '_start_at'
            },
            y: [
              {
                'label': 'One',
                'categoryId': 'one',
                'key': 'value:sum',
              },
              {
                'label': 'One',
                'categoryId': 'one',
                'key': 'value:sum',
                'timeshift': 2
              },
              {
                'label': 'Two',
                'categoryId': 'two',
                'key': 'value:sum',
              },
              {
                'label': 'Three',
                'categoryId': 'three',
                'key': 'value:sum',
              }
            ]
          }
        });

        var parsed = collection.parse(response);
        expect(parsed.length).toBe(3);
        expect(parsed).toEqual(expected);
      });


      it('should cope if none of the specified series are present in the response', function () {

        var collection = new GroupedTimeshiftCollection([], {
          valueAttr: 'value',
          period: 'week',
          category: 'key',
          duration: 2,
          axes: {
            x: {
              'label': 'Date',
              'key': '_start_at'
            },
            y: [
              {
                'label': 'Three',
                'categoryId': 'three',
                'key': 'value:sum',
              }
            ]
          }
        });

        var parsed = collection.parse(response);
        expect(parsed.length).toBe(0);
        expect(parsed).toEqual([]);
      });

    });


  });
});
