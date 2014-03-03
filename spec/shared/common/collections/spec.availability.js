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

      describe('getDataByTableFormat', function () {
        var collection;
        beforeEach(function () {
          spyOn(MatrixCollection.prototype, 'getDataByTableFormat');
          collection = new AvailiabilityCollection({}, {
            denominatorMatcher: 'start',
            numeratorMatcher: 'done'
          });
          collection.options.axes = {
            'x': {
              'label': 'Time',
              'key': 'a'
            },
            'y': {
              'label': 'Service Availability',
              'key': 'b'
            }
          };
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

        it('picks the correct title using valueAttr', function () {
          expect(collection.getDataByTableFormat('avgresponse')[0][1]).toEqual('Page load time');
          expect(collection.getDataByTableFormat('uptimeFraction')[0][1]).toEqual('Uptime');
        });

        it('takes the title from the axes config if valueAttr isnt passed', function () {
          expect(collection.getDataByTableFormat()[0][1]).toEqual('Service Availability');
        });

        it('formats the date to hour', function () {
          collection.options.valueAttr = 'hour';
          expect(collection.getDataByTableFormat()[1][0]).toEqual('12:00:00 am');
        });

        it('formats the date to day by default', function () {
          expect(collection.getDataByTableFormat()[1][0]).toEqual('1 August');
        });
      });
    });
  });
