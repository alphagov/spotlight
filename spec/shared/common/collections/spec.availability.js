define([
  'common/collections/availability'
],
  function (AvailabilityCollection) {
    describe('AvailabilityCollection', function () {
      var availabilityData = {'data': [
        {
          'uptime:sum': 9,
          'downtime:sum': 1,
          'unmonitored:sum': 1,
          'avgresponse:mean': 321
        },
        {
          'uptime:sum': 10,
          'downtime:sum': 0,
          'unmonitored:sum': 1,
          'avgresponse:mean': 345
        }
      ]};

      var options = {
        checkName: 'anything',
        'data-group': 'anything',
        'data-type': 'monitoring',
        parse: true
      };

      it('should be created with correct query parameters', function () {
        var collection =
          new AvailabilityCollection(null, {
            checkName: 'mycheck',
            'data-group': 'something-something-fco',
            'data-type': 'monitoring',
            'endAt': '2012-04-01T00:00:00+00:00'
          });
        var params = collection.queryParams();
        expect(params.period).toEqual('day');
        expect(params.collect).toEqual(['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']);
        expect(params.end_at).toEqual('2012-04-01T00:00:00+00:00');
      });

      it('should be created with correct query parameters, if period set', function () {
        var collection =
          new AvailabilityCollection(null, {
            checkName: 'mycheck',
            'data-group': 'something-something-fco',
            'data-type': 'monitoring',
            'endAt': '2012-04-01T00:00:00+00:00',
            'period': 'hour'
          });
        var params = collection.queryParams();
        expect(params.period).toEqual('hour');
        expect(params.collect).toEqual(['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']);
        expect(params.end_at).toEqual('2012-04-01T00:00:00+00:00');
      });

      it('should provide percentage of uptime for all models', function () {
        var collection = new AvailabilityCollection(availabilityData, options);
        var fractionOfUptime = collection.getFractionOfUptime();

        expect(fractionOfUptime).toEqual(0.95);
      });

      it('should provide total uptime', function () {
        var collection = new AvailabilityCollection(availabilityData, options);
        var totalUptime = collection._getTotalUptime();

        expect(totalUptime).toEqual(19);
      });

      it('should return null total uptime when no data is available', function () {
        var collection = new AvailabilityCollection(null, options);
        expect(collection._getTotalUptime()).toEqual(null);
      });

      it('should provide total (monitored) time', function () {
        var collection = new AvailabilityCollection({'data': [{
          'uptime:sum': 1,
          'downtime:sum': 2,
          'unmonitored:sum': 3
        }]}, options);
        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(3);
      });

      it('should provide total monitored and unmonitored time when told to', function () {
        var collection = new AvailabilityCollection({'data': [{
          'uptime:sum': 1,
          'downtime:sum': 2,
          'unmonitored:sum': 3
        }]}, options);
        var totalTime = collection._getTotalTime(true);

        expect(totalTime).toEqual(6);
      });

      it('should provide total time for all models', function () {
        var collection = new AvailabilityCollection(availabilityData, options);
        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(20);
      });

      it('should return null total time when no data is available', function () {
        var collection = new AvailabilityCollection(null, options);
        expect(collection._getTotalTime()).toEqual(null);
      });

      it('should provide average response time', function () {
        var collection = new AvailabilityCollection(availabilityData, options);
        var averageResponseTime = collection.getAverageResponseTime();

        expect(averageResponseTime).toEqual(333);
      });

      it('should return null average response time when no data is available', function () {
        var collection = new AvailabilityCollection(null, options);
        expect(collection.getAverageResponseTime()).toEqual(null);
      });

      it('should parse data with end_at as the timestamp and start at as an hour earlier', function () {
        var response = {
          data: [
            {
              '_end_at': '2013-06-17T16:00:00+00:00',
              '_start_at': '2013-06-17T15:00:00+00:00',
              'uptime:sum': 900,
              'downtime:sum': 100,
              'unmonitored:sum': 0,
              'avgresponse:mean': 100
            }
          ]
        };
        var collection = new AvailabilityCollection(availabilityData, options);
        var data = collection.parse(response);

        expect(data[0]._start_at).toEqual(collection.moment('2013-06-17T15:00:00+00:00'));
        expect(data[0]._end_at).toEqual(collection.moment('2013-06-17T16:00:00+00:00'));
      });

      it('should parse null data without resorting to NaN', function () {
        var response = {
          data: [
            {
              '_count': 0,
              '_end_at': '2013-10-21T11:00:00+00:00',
              '_start_at': '2013-10-21T10:00:00+00:00',
              'uptime:sum': null,
              'downtime:sum': null,
              'unmonitored:sum': null,
              'avgresponse:mean': null
            }
          ]
        };
        var collection = new AvailabilityCollection(availabilityData, options);
        var data = collection.parse(response);

        expect(data[0].total).toEqual(null);
        expect(data[0].uptimeFraction).toEqual(null);
      });

    });
  });
