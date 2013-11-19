define([
  'common/collections/completion_numbers',
  'moment'
],
function (VolumetricsCollection, moment) {
    var someFakeFCOTransactionDataLabel = [
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 5
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 7
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 9
      },
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 4
      }
    ];

    var missingDataLabel = [
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 5
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 9
      },
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 4
      }
    ];

    var someFakeFCOTransactionDataCategory = [
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 5
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 7
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 9
      },
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 4
      }
    ];

    var missingDataCategory = [
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 5
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        uniqueEvents: 9
      },
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 3
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        uniqueEvents: 4
      }
    ];

    describe("changes", function (){
      it("should not have so many duplicate tests with completion_rate_series", function (){
        expect(true).toEqual(false);
      });
    });

    describe("FCO volumetrics collections", function () {

      sharedBehaviourForVolumetrics({
        data: someFakeFCOTransactionDataCategory,
        start_matcher: /start$/,
        start_matcher_suffix: "start",
        end_matcher: /done$/,
        matching_attribute: "eventCategory"
      });

      sharedBehaviourForVolumetricsWithMissingData({
        data: missingDataCategory,
        start_matcher: /start$/,
        start_matcher_suffix: "start",
        end_matcher: /done$/,
        matching_attribute: "eventCategory"
      });

      sharedBehaviourForVolumetrics({
        data: someFakeFCOTransactionDataLabel,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel"
      });

      sharedBehaviourForVolumetricsWithMissingData({
        data: missingDataLabel,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel"
      });

      function sharedBehaviourForVolumetrics(context) {

        var volumetricsCollection = undefined,
            collectionFor = function (data) {
              collection = new VolumetricsCollection({}, {
                "data-group": 'notARealFCOTransaction',
                "data-type": 'journey',
                startMatcher: context.start_matcher,
                endMatcher: context.end_matcher,
                matchingAttribute: context.matching_attribute
              });
              collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
              return collection;
            };

        beforeEach(function () {
          volumetricsCollection = collectionFor({data: context.data});
        });

        it("should query backdrop for journey data for the specified service", function () {
          expect(volumetricsCollection.url()).toContain("journey");
          expect(volumetricsCollection.url()).toContain("notARealFCOTransaction");
        });

        it("should count the total number of people starting the transaction", function () {
          volumetricsCollection.data = context.data;
          expect(volumetricsCollection.numberOfJourneyStarts()).toEqual(21);
        });

        it("should count the total number of people completing the transaction", function () {
          volumetricsCollection.data = context.data;
          expect(volumetricsCollection.numberOfJourneyCompletions()).toEqual(10);
        });

        it("should give the total completion rate as a percentage", function () {
          volumetricsCollection.data = context.data;
          expect(volumetricsCollection.completionRate()).toBeCloseTo(0.476, 0.01);
        });

        it("should give a series for applications", function () {
          var parse = volumetricsCollection.parse({data: context.data});
          expect(parse.title).toBe("Done");
          expect(parse.id).toBe("done");
          expect(parse.weeks.total).toBe(3);
          expect(parse.weeks.available).toBe(3);
          expect(parse.mean).toBeCloseTo(3.33, 0.01);
          expect(parse.values).not.toBeUndefined();
        });

        it("should map applications to application series", function () {
          var firstValue = volumetricsCollection.parse({data: context.data}).values[6];
          expect(firstValue.get('_start_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
          expect(firstValue.get('_end_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(firstValue.get('uniqueEvents')).toBe(3);
          var secondValue = volumetricsCollection.parse({data: context.data}).values[7];
          expect(secondValue.get('_start_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(secondValue.get('_end_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(secondValue.get('uniqueEvents')).toBe(3);
          var thirdValue = volumetricsCollection.parse({data: context.data}).values[8];
          expect(thirdValue.get('_start_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(thirdValue.get('_end_at')).toBeMoment(moment("2013-07-01T01:00:00+01:00"));
          expect(thirdValue.get('uniqueEvents')).toBe(4);
        });

        it("should query for 9 weeks of data for application series", function () {
          expect(volumetricsCollection.parse({data: context.data}).values.length).toBe(9);
        });

        it("should pad out missing data for application series", function () {
          var paddedValue = volumetricsCollection.parse({data: context.data}).values[5];
          expect(paddedValue.get('_start_at')).toBeMoment(moment("2013-06-03T01:00:00+01:00"));
          expect(paddedValue.get('_end_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
          expect(paddedValue.get('uniqueEvents')).toBe(null);

          var paddedValue2 = volumetricsCollection.parse({data: context.data}).values[4];
          expect(paddedValue2.get('_start_at')).toBeMoment(moment("2013-05-27T01:00:00+01:00"));
          expect(paddedValue2.get('_end_at')).toBeMoment(moment("2013-06-03T01:00:00+01:00"));
          expect(paddedValue2.get('uniqueEvents')).toBe(null);
        });

      }

      function sharedBehaviourForVolumetricsWithMissingData(context) {

        var volumetricsCollection = undefined,
            collectionFor = function (data) {
              collection  = new VolumetricsCollection({}, {
                "data-group": 'notARealFCOTransaction',
                "data-type": 'journey',
                startMatcher: context.start_matcher,
                endMatcher: context.end_matcher,
                matchingAttribute: context.matching_attribute
              });
              collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
              return collection;
            };

        beforeEach(function () {
          volumetricsCollection = collectionFor({data: context.data});
        });

        it("should ignore missing data for applications", function () {
          var parse = volumetricsCollection.parse({data: context.data});

          expect(parse.weeks.total).toBe(3);
          expect(parse.weeks.available).toBe(2);
          expect(parse.mean).toBeCloseTo(3.5, 0.01);
        });
        
      }

    });
  }
);
