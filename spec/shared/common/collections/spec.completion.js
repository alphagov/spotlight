define([
  'common/collections/completion',
  'extensions/collections/collection',
  'extensions/collections/matrix'
],
function (CompletionCollection, Collection, MatrixCollection) {
  describe('Completion collection', function () {
    var mockResponse = {
      'data': [
        {
          'eventCategory': 'start',
          'uniqueEvents:sum': 40.0,
          'values': [
            {
              '_end_at': '2013-12-02T00:00:00+00:00',
              '_start_at': '2013-11-25T00:00:00+00:00',
              'uniqueEvents:sum': 15.0
            },
            {
              '_end_at': '2013-12-09T00:00:00+00:00',
              '_start_at': '2013-12-02T00:00:00+00:00',
              'uniqueEvents:sum': 25.0
            }
          ]
        },
        {
          'eventCategory': 'confirm',
          'uniqueEvents:sum': 20.0,
          'values': [
            {
              '_end_at': '2013-12-02T00:00:00+00:00',
              '_start_at': '2013-11-25T00:00:00+00:00',
              'uniqueEvents:sum': 8.0
            },
            {
              '_end_at': '2013-12-09T00:00:00+00:00',
              '_start_at': '2013-12-02T00:00:00+00:00',
              'uniqueEvents:sum': 12.0
            }
          ]
        },
        {
          'eventCategory': 'done',
          'uniqueEvents:sum': 10.0,
          'values': [
            {
              '_end_at': '2013-12-02T00:00:00+00:00',
              '_start_at': '2013-11-25T00:00:00+00:00',
              'uniqueEvents:sum': 10.0
            },
            {
              '_end_at': '2013-12-09T00:00:00+00:00',
              '_start_at': '2013-12-02T00:00:00+00:00',
              'uniqueEvents:sum': null
            }
          ]
        }
      ]
    };

    it('should use options in query params', function() {
      var collection = new CompletionCollection({}, {
        valueAttr: 'one',
        period: 'month',
        matchingAttribute: 'two',
        tabbedAttr: 'tabbing',
        tabs: [
          { id: 'tabid' }
        ]
      });

      expect(collection.url()).toContain('period=month');
      expect(collection.url()).toContain('collect=one');
      expect(collection.url()).toContain('group_by=two');
      expect(collection.url()).toContain('tabbing=tabid');
    });

    it('should use default query params', function() {
      var collection = new CompletionCollection({}, {});

      expect(collection.url()).toContain('period=week');
      expect(collection.url()).toContain('collect=uniqueEvents%3Asum');
      expect(collection.url()).toContain('group_by=eventCategory');
    });

    it('should update value attribute on parse', function() {
      var collection = new CompletionCollection({}, { valueAttr: 'one' });
      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

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
      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

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

    it('should allow matcher to be a regex', function () {
      var collection = new CompletionCollection({}, {
        denominatorMatcher: 'start',
        numeratorMatcher: '(confirm|done)'
      });
      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

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

    describe('getDataByTableFormat', function () {
      var collection;
      beforeEach(function () {
        spyOn(MatrixCollection.prototype, 'getDataByTableFormat');
        collection = new CompletionCollection({}, {
          denominatorMatcher: 'start',
          numeratorMatcher: 'done'
        });
        collection.options.axes = {
          x: {
            label: 'Date of completion',
            key: 'a'
          },
          y: [
            {
              label: 'Completion Percentage',
              key: 'b'
            }
          ]
        };
        collection.period = 'month'
        collection.at(0).set('values', new Collection([
          { a: '2012-08-01T00:00:00+00:00', b: 0.215 },
          { a: '2014-01-30T11:32:02+00:00', b: 0.408 }
        ]));
      });

      it('calls the MatrixCollection getDataByTableFormat if no axis data is set', function () {
        delete collection.options.axes;
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

      it('sorts the array by tabular format with the correct timestamp format and raw percentage data', function () {
        var expected = [['Date of completion (month)', 'Completion Percentage'], ['August 2012', 0.215], ['January 2014', 0.408]];

        expect(collection.getDataByTableFormat()).toEqual(expected);
      });
    });
  });
});
