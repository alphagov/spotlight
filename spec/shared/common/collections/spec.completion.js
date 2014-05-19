define([
  'common/collections/completion'
],
function (CompletionCollection) {
  /* global decodeURIComponent */
  describe('Completion collection', function () {
    var mockResponse;

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


      CompletionCollection.prototype.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      CompletionCollection.prototype.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

    });

    it('should use options in query params', function () {
      var collection = new CompletionCollection({}, {
        valueAttr: 'one',
        period: 'month',
        startAt: '2014-01-10T00:00:00+00:00',
        endAt: '2014-03-10T00:00:00+00:00',
        matchingAttribute: 'two',
        tabbedAttr: 'tabbing',
        tabs: [
          { id: 'tabid' }
        ],
        filterBy: ['new_or_continuing:new', 'channel:digital']
      });

      expect(decodeURIComponent(collection.url())).toContain('period=month');
      expect(decodeURIComponent(collection.url())).toContain('start_at=2014-01-10T00:00:00+00:00');
      expect(decodeURIComponent(collection.url())).toContain('end_at=2014-03-10T00:00:00+00:00');
      expect(decodeURIComponent(collection.url())).toContain('collect=one');
      expect(decodeURIComponent(collection.url())).toContain('group_by=two');
      expect(decodeURIComponent(collection.url())).toContain('tabbing=tabid');
      expect(decodeURIComponent(collection.url())).toContain('filter_by=new_or_continuing:new&filter_by=channel:digital');
    });

    it('should use default query params', function () {
      var collection = new CompletionCollection({}, {});

      expect(decodeURIComponent(collection.url())).toContain('period=week');
      expect(decodeURIComponent(collection.url())).toContain('collect=uniqueEvents:sum');
      expect(decodeURIComponent(collection.url())).toContain('group_by=eventCategory');
    });

    it('should recognise query parameters passed in from the module', function () {
      var collection = new CompletionCollection({}, {
        queryParams: {
          'filter_by': 'foo:bar'
        }
      });

      expect(collection.url()).toContain('filter_by=foo%3Abar');
    });

    it('should update value attribute on parse', function () {
      var collection = new CompletionCollection({}, { valueAttr: 'one' });

      expect(collection.valueAttr).toEqual('one');
      collection.options.valueAttr = 'two';
      collection.parse(mockResponse);
      expect(collection.valueAttr).toEqual('two');
    });

    it('should parse responses', function () {
      var collection = new CompletionCollection({}, {
        denominatorMatcher: 'start',
        numeratorMatcher: 'done'
      });

      var result = collection.parse(mockResponse);

      expect(result._start).toEqual(40);
      expect(result._end).toEqual(10);
      expect(result.values.length).toEqual(2);
      expect(result.values[0].attributes).toEqual({
        _start_at: collection.getMoment('2013-11-25T00:00:00+00:00'),
        _end_at: collection.getMoment('2013-12-02T00:00:00+00:00'),
        _start: 15,
        _end: 10
      });
      expect(result.values[1].attributes).toEqual({
        _start_at: collection.getMoment('2013-12-02T00:00:00+00:00'),
        _end_at: collection.getMoment('2013-12-09T00:00:00+00:00'),
        _start: 25,
        _end: null
      });
      expect(collection.defaultValueAttrs).toHaveBeenCalled();
      expect(collection.defaultCollectionAttrs).toHaveBeenCalled();
    });

    it('should handle an empty data response', function () {
      var collection = new CompletionCollection({}, {}),
          response = {data: []},
          parsedResponse = {values: [], _start: null, _end: null};

      expect(collection.parse(response)).toEqual(parsedResponse);
    });

    it('should allow matcher to be a regex', function () {
      var collection = new CompletionCollection({}, {
        denominatorMatcher: 'start',
        numeratorMatcher: '(confirm|done)'
      });

      var result = collection.parse(mockResponse);

      expect(result._start).toEqual(40);
      expect(result._end).toEqual(30);
      expect(result.values.length).toEqual(2);
      expect(result.values[0].attributes).toEqual({
        _start_at: collection.getMoment('2013-11-25T00:00:00+00:00'),
        _end_at: collection.getMoment('2013-12-02T00:00:00+00:00'),
        _start: 15,
        _end: 18
      });
      expect(result.values[1].attributes).toEqual({
        _start_at: collection.getMoment('2013-12-02T00:00:00+00:00'),
        _end_at: collection.getMoment('2013-12-09T00:00:00+00:00'),
        _start: 25,
        _end: 12
      });
    });

    it('must handle zero values', function () {

      _.each(mockResponse.data, function (dataset) {
        _.each(dataset.values, function (datapoint) {
          datapoint['uniqueEvents:sum'] = 0;
        });
      });
      var collection = new CompletionCollection({}, {});
      var result = collection.parse(mockResponse);

      expect(result.values[0].get('_end')).toEqual(0);
      expect(result.values[1].get('_end')).toEqual(0);

    });

    it('must handle null values', function () {

      _.each(mockResponse.data, function (dataset) {
        _.each(dataset.values, function (datapoint) {
          datapoint['uniqueEvents:sum'] = null;
        });
      });
      var collection = new CompletionCollection({}, {});
      var result = collection.parse(mockResponse);

      expect(result.values[0].get('_end')).toEqual(null);
      expect(result.values[1].get('_end')).toEqual(null);

    });
  });
});
