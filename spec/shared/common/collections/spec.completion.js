define([
  'common/collections/completion'
],
function (CompletionCollection) {
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

    var someFakeFCOTransactionDataCategory = [
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        value: 5
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        value: 7
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:start",
        value: 9
      },
      {
        _timestamp: "2013-06-09T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        value: 3
      },
      {
        _timestamp: "2013-06-16T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        value: 3
      },
      {
        _timestamp: "2013-06-23T23:00:00+00:00",
        eventCategory: "fco-transaction-name:done",
        value: 4
      }
    ];

    describe("FCO volumetrics collections", function () {

      sharedBehaviourForCompletion({
        data: someFakeFCOTransactionDataCategory,
        start_matcher: /start$/,
        start_matcher_suffix: "start",
        end_matcher: /done$/,
        value_attribute: "value"
      });

      sharedBehaviourForCompletion({
        data: someFakeFCOTransactionDataLabel,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel"
      });

      function sharedBehaviourForCompletion(context) {

        var volumetricsCollection = undefined,
            collectionFor = function (data) {
              collection = new CompletionCollection({}, {
                "data-group": 'notARealFCOTransaction',
                "data-type": 'journey',
                startMatcher: context.start_matcher,
                endMatcher: context.end_matcher,
                matchingAttribute: context.matching_attribute,
                valueAttribute: context.value_attribute
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
          expect(volumetricsCollection.completionRate()).toBeCloseTo(0.476, 1);
        });

      }

    });
  }
);
