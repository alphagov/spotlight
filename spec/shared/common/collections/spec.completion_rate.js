define([
  'common/collections/completion_rate'
],
function (CompletionCollection) {
  describe('Completion rate collection', function () {

    var mockResponse,
    flatMockResponse;

    beforeEach(function () {
      mockResponse = {
        data: [
          {
            eventCategory: 'start',
            'uniqueEvents:sum': 40.0,
            values: [
              {
                _end_at: '2013-12-02T00:00:00+00:00',
                _start_at: '2013-11-25T00:00:00+00:00',
                'uniqueEvents:sum': 15.0
              },
              {
                _end_at: '2013-12-09T00:00:00+00:00',
                _start_at: '2013-12-02T00:00:00+00:00',
                'uniqueEvents:sum': 25.0
              }
            ]
          },
          {
            eventCategory: 'confirm',
            'uniqueEvents:sum': 20.0,
            values: [
              {
                _end_at: '2013-12-02T00:00:00+00:00',
                _start_at: '2013-11-25T00:00:00+00:00',
                'uniqueEvents:sum': 8.0
              },
              {
                _end_at: '2013-12-09T00:00:00+00:00',
                _start_at: '2013-12-02T00:00:00+00:00',
                'uniqueEvents:sum': 12.0
              }
            ]
          },
          {
            eventCategory: 'done',
            'uniqueEvents:sum': 10.0,
            values: [
              {
                _end_at: '2013-12-02T00:00:00+00:00',
                _start_at: '2013-11-25T00:00:00+00:00',
                'uniqueEvents:sum': 10.0
              },
              {
                _end_at: '2013-12-09T00:00:00+00:00',
                _start_at: '2013-12-02T00:00:00+00:00',
                'uniqueEvents:sum': null
              }
            ]
          }
        ]
      };

      flatMockResponse = {
        data: [
              {
                _end_at: '2013-12-02T00:00:00+00:00',
                _start_at: '2013-11-25T00:00:00+00:00',
                eventCategory: 'start',
                'uniqueEvents:sum': 15.0
              },
              {
                _end_at: '2013-12-09T00:00:00+00:00',
                _start_at: '2013-12-02T00:00:00+00:00',
                eventCategory: 'start',
                'uniqueEvents:sum': 25.0
              },
              {
                _end_at: '2013-12-02T00:00:00+00:00',
                _start_at: '2013-11-25T00:00:00+00:00',
                eventCategory: 'confirm',
                'uniqueEvents:sum': 8.0
              },
              {
                _end_at: '2013-12-09T00:00:00+00:00',
                _start_at: '2013-12-02T00:00:00+00:00',
                eventCategory: 'confirm',
                'uniqueEvents:sum': 12.0
              },
              {
                _end_at: '2013-12-02T00:00:00+00:00',
                _start_at: '2013-11-25T00:00:00+00:00',
                eventCategory: 'done',
                'uniqueEvents:sum': 10.0
              },
              {
                _end_at: '2013-12-09T00:00:00+00:00',
                _start_at: '2013-12-02T00:00:00+00:00',
                eventCategory: 'done',
                'uniqueEvents:sum': null
              }
        ]
      };

    });

    it('throws if no denominatorMatcher is defined', function () {
      var fn = function () {
        return new CompletionCollection({}, {
          numeratorMatcher: 'foo'
        });
      };
      expect(fn).toThrow();
    });

    it('throws if no numeratorMatcher is defined', function () {
      var fn = function () {
        return new CompletionCollection({}, {
          denominatorMatcher: 'foo'
        });
      };
      expect(fn).toThrow();
    });

    describe('parse', function () {

      it('should parse responses', function () {
        var collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });

        var result = collection.parse(mockResponse);

        expect(result.length).toEqual(2);
        expect(result[0]._start).toEqual(15);
        expect(result[1]._start).toEqual(25);
        expect(result[0]._end).toEqual(10);
        expect(result[1]._end).toEqual(null);
        expect(result[0].completion).toEqual(2 / 3);
        expect(result[1].completion).toEqual(0);
      });

      it('should parse flat responses', function () {
        var collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum',
          flat: true
        });

        var result = collection.parse(flatMockResponse);

        expect(result.length).toEqual(2);
        expect(result[0]._start).toEqual(15);
        expect(result[1]._start).toEqual(25);
        expect(result[0]._end).toEqual(10);
        expect(result[1]._end).toEqual(null);
        expect(result[0].completion).toEqual(2 / 3);
        expect(result[1].completion).toEqual(0);
      });

      it('should parse flat responses with null matchingAttribute', function () {
        var collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum',
          flat: true
        });
        delete flatMockResponse['data'][0]['eventCategory'];
        var result = collection.parse(flatMockResponse);
        expect(result.length).toEqual(1);
      });

      it('should handle an empty data response', function () {
        var collection = new CompletionCollection({}, {
            denominatorMatcher: 'start',
            numeratorMatcher: 'done',
            matchingAttribute: 'eventCategory',
            valueAttr: 'uniqueEvents:sum'
          }),
          response = {data: []};

        expect(collection.parse(response)).toEqual([]);
      });

      it('should allow matcher to be a regex', function () {
        var collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: '(confirm|done)',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });

        var result = collection.parse(mockResponse);

        expect(result.length).toEqual(2);
        expect(result[0]._start).toEqual(15);
        expect(result[1]._start).toEqual(25);
        expect(result[0]._end).toEqual(18);
        expect(result[1]._end).toEqual(12);
        expect(result[0].completion).toEqual(18 / 15);
        expect(result[1].completion).toEqual(12 / 25);
      });

      it('must handle zero values', function () {

        _.each(mockResponse.data, function (dataset) {
          _.each(dataset.values, function (datapoint) {
            datapoint['uniqueEvents:sum'] = 0;
          });
        });
        var collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });
        var result = collection.parse(mockResponse);

        expect(result[0]._start).toEqual(0);
        expect(result[1]._start).toEqual(0);
        expect(result[0]._end).toEqual(0);
        expect(result[1]._end).toEqual(0);
        expect(result[0].completion).toEqual(null);
        expect(result[1].completion).toEqual(null);

      });

      it('must handle null values', function () {

        _.each(mockResponse.data, function (dataset) {
          _.each(dataset.values, function (datapoint) {
            datapoint['uniqueEvents:sum'] = null;
          });
        });
        var collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });
        var result = collection.parse(mockResponse);

        expect(result[0]._start).toEqual(null);
        expect(result[1]._start).toEqual(null);
        expect(result[0]._end).toEqual(null);
        expect(result[1]._end).toEqual(null);
        expect(result[0].completion).toEqual(null);
        expect(result[1].completion).toEqual(null);

      });
    });

    describe('mean', function () {

      var collection;

      beforeEach(function () {
        collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });
        collection.reset(mockResponse, { parse: true });
      });

      it('returns the overall mean completion if called with "completion"', function () {
        expect(collection.mean('completion')).toEqual(0.25);
      });

      it('returns null for an empty collection', function () {
        collection = new CompletionCollection([], {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });
        expect(collection.mean('completion')).toBeNull();
      });

      it('returns zero if no "ended" values', function () {
        collection = new CompletionCollection([], {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done',
          matchingAttribute: 'eventCategory',
          valueAttr: 'uniqueEvents:sum'
        });
        collection.reset(mockResponse, { parse: true });
        collection.each(function (model) {
          model.set('_end', null);
        });
        expect(collection.mean('completion')).toEqual(0);
      });

    });

  });
});
