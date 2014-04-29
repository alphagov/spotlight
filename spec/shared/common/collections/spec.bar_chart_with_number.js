define([
  'common/collections/bar_chart_with_number',
  'extensions/collections/collection',
  'extensions/collections/matrix',
  'extensions/models/query'
],
function (BarChartWithNumberCollection) {
  describe('BarChartWithNumber collection', function () {
    var mockResponse = {
      'data': [
        {
          '_day_start_at': '2012-07-01T00:00:00+00:00',
          '_hour_start_at': '2012-07-01T00:00:00+00:00',
          '_id': 'MjAxMi0wNy0wMSAwMDowMDowMDIwMTItMTAtMDEgMDA6MDA6MDBkZnQtcmVxdWVzdC1zdGF0dXRvcnktb2ZmLXJvYWQtbm90aWNlLXNvcm4=',
          '_month_start_at': '2012-07-01T00:00:00+00:00',
          '_quarter_start_at': '2012-07-01T00:00:00+00:00',
          '_timestamp': '2012-07-01T00:00:00+00:00',
          '_updated_at': '2014-03-19T10:44:32.478000',
          '_week_start_at': '2012-06-25T00:00:00+00:00',
          'end_at': '2012-10-01T00:00:00+00:00',
          'number_of_digital_transactions': 795935,
          'number_of_transactions': 971867,
          'period': 'quarter',
          'service_id': 'dft-request-statutory-off-road-notice-sorn',
          'type': 'quarterly'
        },
        {
          '_day_start_at': '2012-10-01T00:00:00+00:00',
          '_hour_start_at': '2012-10-01T00:00:00+00:00',
          '_id': 'MjAxMi0xMC0wMSAwMDowMDowMDIwMTMtMDEtMDEgMDA6MDA6MDBkZnQtcmVxdWVzdC1zdGF0dXRvcnktb2ZmLXJvYWQtbm90aWNlLXNvcm4=',
          '_month_start_at': '2012-10-01T00:00:00+00:00',
          '_quarter_start_at': '2012-10-01T00:00:00+00:00',
          '_timestamp': '2012-10-01T00:00:00+00:00',
          '_updated_at': '2014-03-19T10:44:32.479000',
          '_week_start_at': '2012-10-01T00:00:00+00:00',
          'end_at': '2013-01-01T00:00:00+00:00',
          'number_of_digital_transactions': 844399,
          'number_of_transactions': 1016783,
          'period': 'quarter',
          'service_id': 'dft-request-statutory-off-road-notice-sorn',
          'type': 'quarterly'
        },
        {
          '_day_start_at': '2013-01-01T00:00:00+00:00',
          '_hour_start_at': '2013-01-01T00:00:00+00:00',
          '_id': 'MjAxMy0wMS0wMSAwMDowMDowMDIwMTMtMDQtMDEgMDA6MDA6MDBkZnQtcmVxdWVzdC1zdGF0dXRvcnktb2ZmLXJvYWQtbm90aWNlLXNvcm4=',
          '_month_start_at': '2013-01-01T00:00:00+00:00',
          '_quarter_start_at': '2013-01-01T00:00:00+00:00',
          '_timestamp': '2013-01-01T00:00:00+00:00',
          '_updated_at': '2014-03-19T10:44:32.479000',
          '_week_start_at': '2012-12-31T00:00:00+00:00',
          'end_at': '2013-04-01T00:00:00+00:00',
          'number_of_digital_transactions': 783646,
          'number_of_transactions': 944200,
          'period': 'quarter',
          'service_id': 'dft-request-statutory-off-road-notice-sorn',
          'type': 'quarterly'
        }
      ]
    };

    it('should set _start_at to the quarterly start date if the period is set to quarter', function () {
      var collection = new BarChartWithNumberCollection({}, {});
      collection.axisPeriod = 'quarter';
      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

      var responseCopy = _.clone(mockResponse, true);
      var result = collection.parse(responseCopy);

      expect(result.values[0].get('_start_at')).toEqual('2012-07-01T00:00:00+00:00');
      expect(result.values[1].get('_start_at')).toEqual('2012-10-01T00:00:00+00:00');
      expect(result.values[2].get('_start_at')).toEqual('2013-01-01T00:00:00+00:00');

    });

    it('should set _start_at to the weekly start date if the period is not defined', function () {
      var collection = new BarChartWithNumberCollection({}, {});
      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

      var responseCopy = _.clone(mockResponse, true);
      var result = collection.parse(responseCopy);

      expect(result.values[0].get('_start_at')).toEqual('2012-06-25T00:00:00+00:00');
      expect(result.values[1].get('_start_at')).toEqual('2012-10-01T00:00:00+00:00');
      expect(result.values[2].get('_start_at')).toEqual('2012-12-31T00:00:00+00:00');

    });

    it('should only use the last 5 elements from longer datasets', function () {
      var collection = new BarChartWithNumberCollection({}, {});
      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

      var responseCopy = _.clone(mockResponse, true);
      responseCopy.data = responseCopy.data.concat(responseCopy.data);
      var result = collection.parse(responseCopy);

      expect(result.values.length).toEqual(5);
      expect(result.values[0].get('_start_at')).toEqual('2012-10-01T00:00:00+00:00');
    });

    it('should not blow up when the response is empty', function () {
      var collection = new BarChartWithNumberCollection({}, {}),
          response = {data: []},
          parsedResponse = {values: [] };

      collection.defaultValueAttrs = jasmine.createSpy().andCallFake(function () { return {}; });
      collection.defaultCollectionAttrs = jasmine.createSpy().andCallFake(function () { return {}; });

      expect(collection.parse(response)).toEqual(parsedResponse);
    });

    it('should not blow up when the response is undefined', function () {
      var collection = new BarChartWithNumberCollection({}, {});
      collection.valueAttr = 'unknown';

      var responseCopy = _.clone(mockResponse, true);
      var result = collection.parse(responseCopy);

      expect(result.values[0].get(collection.valueAttr)).toBeDefined();
    });

  });

});
