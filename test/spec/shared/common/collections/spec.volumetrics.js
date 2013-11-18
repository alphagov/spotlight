define([
  'common/collections/volumetrics',
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
              collection = new VolumetricsCollection({ data: data }, {
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
          volumetricsCollection = collectionFor(context.data);
        });

        it("should query backdrop for journey data for the specified service", function () {
          expect(volumetricsCollection.url()).toContain("journey");
          expect(volumetricsCollection.url()).toContain("notARealFCOTransaction");
        });

        it("should count the total number of people starting the transaction", function () {
          expect(volumetricsCollection.numberOfJourneyStarts()).toEqual(21);
        });

        it("should count the total number of people completing the transaction", function () {
          expect(volumetricsCollection.numberOfJourneyCompletions()).toEqual(10);
        });

        it("should give the total completion rate as a percentage", function () {
          expect(volumetricsCollection.completionRate()).toBeCloseTo(0.476, 0.01);
        });

        it("should give a series for applications", function () {
          var applicationsSeries = volumetricsCollection.applicationsSeries();
          expect(applicationsSeries.title).toBe("Done");
          expect(applicationsSeries.id).toBe("done");
          expect(applicationsSeries.weeks.total).toBe(3);
          expect(applicationsSeries.weeks.available).toBe(3);
          expect(applicationsSeries.mean).toBeCloseTo(3.33, 0.01);
          expect(applicationsSeries.values).not.toBeUndefined();
        });

        it("should give a series for completion rate", function () {
          var completionSeries = volumetricsCollection.completionSeries();
          expect(completionSeries.title).toBe("Completion rate");
          expect(completionSeries.id).toBe("completion");
          expect(completionSeries.weeks.total).toBe(3);
          expect(completionSeries.weeks.available).toBe(3);
          expect(completionSeries.totalCompletion).toBeCloseTo(0.476, 0.01);
          expect(completionSeries.values.length).not.toBeUndefined();
        });

        it("should map applications to application series", function () {
          var firstValue = volumetricsCollection.applicationsSeries().values.at(6);
          expect(firstValue.get('_start_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
          expect(firstValue.get('_end_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(firstValue.get('uniqueEvents')).toBe(3);
          var secondValue = volumetricsCollection.applicationsSeries().values.at(7);
          expect(secondValue.get('_start_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(secondValue.get('_end_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(secondValue.get('uniqueEvents')).toBe(3);
          var thirdValue = volumetricsCollection.applicationsSeries().values.at(8);
          expect(thirdValue.get('_start_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(thirdValue.get('_end_at')).toBeMoment(moment("2013-07-01T01:00:00+01:00"));
          expect(thirdValue.get('uniqueEvents')).toBe(4);
        });

        it("should map completion rates to completion series", function () {
          var firstValue = volumetricsCollection.completionSeries().values.at(6);
          expect(firstValue.get('_start_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
          expect(firstValue.get('_end_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(firstValue.get('completion')).toBe(0.6);
          var secondValue = volumetricsCollection.completionSeries().values.at(7);
          expect(secondValue.get('_start_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(secondValue.get('_end_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(secondValue.get('completion')).toBeCloseTo(0.428, 0.001);
          var thirdValue = volumetricsCollection.completionSeries().values.at(8);
          expect(thirdValue.get('_start_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(thirdValue.get('_end_at')).toBeMoment(moment("2013-07-01T01:00:00+01:00"));
          expect(thirdValue.get('completion')).toBeCloseTo(0.4444, 0.001);
        });

        it("should query for 9 weeks of data for application series", function () {
          expect(volumetricsCollection.applicationsSeries().values.length).toBe(9);
        });

        it("should pad out missing data for application series", function () {
          var paddedValue = volumetricsCollection.applicationsSeries().values.at(5);
          expect(paddedValue.get('_start_at')).toBeMoment(moment("2013-06-03T01:00:00+01:00"));
          expect(paddedValue.get('_end_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
          expect(paddedValue.get('uniqueEvents')).toBe(null);

          var paddedValue2 = volumetricsCollection.applicationsSeries().values.at(4);
          expect(paddedValue2.get('_start_at')).toBeMoment(moment("2013-05-27T01:00:00+01:00"));
          expect(paddedValue2.get('_end_at')).toBeMoment(moment("2013-06-03T01:00:00+01:00"));
          expect(paddedValue2.get('uniqueEvents')).toBe(null);
        });

        it("should query for 9 weeks of data for completion series", function () {
          expect(volumetricsCollection.completionSeries().values.length).toBe(9);
        });

        it("should pad out missing data for completions series", function () {
          var paddedValue = volumetricsCollection.completionSeries().values.at(5);
          expect(paddedValue.get('_start_at')).toBeMoment(moment("2013-06-03T01:00:00+0100"));
          expect(paddedValue.get('_end_at')).toBeMoment(moment("2013-06-10T01:00:00+01:00"));
          expect(paddedValue.get('completion')).toBe(null);
        });

        it("should have a completion rate of 0 when there's no done event for the timestamp", function () {
          var data = {_timestamp: "2013-06-09T23:00:00+00:00", uniqueEvents: 5};
          data[context.matching_attribute] = "fco-transaction-name" + context.start_matcher_suffix;

          var events = { data: [
            data
          ]};

          var noDoneEventVolumetricsCollection = function () { 
            collection = new VolumetricsCollection(events, {
              "data-group": 'notARealFCOTransaction',
              "data-type": 'journey',
              startMatcher: context.start_matcher,
              endMatcher: context.end_matcher,
              matchingAttribute: context.matching_attribute
            });
            collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
            return collection;
          }();

          expect(noDoneEventVolumetricsCollection.completionSeries().values.at(8).get('completion')).toBe(0);
        });
      }

      function sharedBehaviourForVolumetricsWithMissingData(context) {

        var volumetricsCollection = undefined,
            collectionFor = function (data) {
              collection  = new VolumetricsCollection({ data: data }, {
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
          volumetricsCollection = collectionFor(context.data);
        });

        it("should ignore missing data for applications", function () {
          var applicationsSeries = volumetricsCollection.applicationsSeries();

          expect(applicationsSeries.weeks.total).toBe(3);
          expect(applicationsSeries.weeks.available).toBe(2);
          expect(applicationsSeries.mean).toBeCloseTo(3.5, 0.01);
        });
        it("should ignore missing data for completion rate", function () {
          var completionSeries = volumetricsCollection.completionSeries();

          expect(completionSeries.weeks.total).toBe(3);
          expect(completionSeries.weeks.available).toBe(2);
          expect(completionSeries.totalCompletion).toBeCloseTo(0.5, 0.01);
        });
        
        it("should have null completion rate for missing data", function () {
          var completionWithMissingData = volumetricsCollection.completionSeries().values;
          var missingValue = completionWithMissingData.at(7);

          expect(missingValue.get('_start_at')).toBeMoment(moment("2013-06-17T01:00:00+01:00"));
          expect(missingValue.get('_end_at')).toBeMoment(moment("2013-06-24T01:00:00+01:00"));
          expect(missingValue.get('completion')).toBe(null);
        });
        
      }

    });
  }
);
