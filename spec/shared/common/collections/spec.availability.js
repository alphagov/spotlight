define([
  'common/collections/availability',
  'extensions/collections/collection',
  'extensions/collections/matrix'
],
  function (AvailiabilityCollection, Collection, MatrixCollection) {
    describe('AvailiabilityCollection', function () {
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
          new AvailiabilityCollection(null, {
            checkName: 'mycheck',
            'data-group': 'something-something-fco',
            'data-type': 'monitoring'
          });
        var params = collection.queryParams();
        expect(params.period).toEqual('day');
        expect(params.collect).toEqual(['downtime:sum', 'uptime:sum', 'unmonitored:sum', 'avgresponse:mean']);
      });

      it('should provide percentage of uptime for all models', function () {
        var collection = new AvailiabilityCollection(availabilityData, options);
        var fractionOfUptime = collection.getFractionOfUptime();

        expect(fractionOfUptime).toEqual(0.95);
      });

      it('should provide total uptime', function () {

        var collection = new AvailiabilityCollection(availabilityData, options);
        var totalUptime = collection._getTotalUptime();

        expect(totalUptime).toEqual(19);
      });

      it('should provide total (monitored) time', function () {
        var collection = new AvailiabilityCollection({'data': [{
          'uptime:sum': 1,
          'downtime:sum': 2,
          'unmonitored:sum': 3
        }]}, options);
        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(3);
      });

      it('should provide total monitored AND unmonitored time', function () {
        var collection = new AvailiabilityCollection({'data': [{
          'uptime:sum': 1,
          'downtime:sum': 2,
          'unmonitored:sum': 3
        }]}, options);
        var totalTime = collection._getTotalTime(true);

        expect(totalTime).toEqual(6);
      });

      it('should provide total time for all models', function () {
        var collection = new AvailiabilityCollection(availabilityData, options);
        var totalTime = collection._getTotalTime();

        expect(totalTime).toEqual(20);
      });

      it('should provide average response time', function () {
        var collection = new AvailiabilityCollection(availabilityData, options);
        var averageResponseTime = collection.getAverageResponseTime();

        expect(averageResponseTime).toEqual(333);
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
        var collection = new AvailiabilityCollection(availabilityData, options);
        var data = collection.parse(response);

        expect(data.values[0]._start_at).toEqual(collection.moment('2013-06-17T15:00:00+00:00'));
        expect(data.values[0]._end_at).toEqual(collection.moment('2013-06-17T16:00:00+00:00'));
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
        var collection = new AvailiabilityCollection(availabilityData, options);
        var data = collection.parse(response);

        expect(data.values[0].total).toEqual(null);
        expect(data.values[0].uptimeFraction).toEqual(null);
      });
    });
  });
