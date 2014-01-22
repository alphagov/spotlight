define([
  'common/collections/completion_rate'
],
function (CompletionRateCollection) {

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
        _timestamp: "2013-06-30T23:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: null
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
      },
      {
        _timestamp: "2013-06-30T23:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: null
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
  
    var someFakeFCOTransactionDataLabelMonthly = [
      {
        _timestamp: "2013-04-01T00:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 5
      },
      {
        _timestamp: "2013-05-01T00:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 7
      },
      {
        _timestamp: "2013-06-01T00:00:00+00:00",
        eventLabel: "fco-transaction-name_begin",
        uniqueEvents: 9
      },
      {
        _timestamp: "2013-04-01T00:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 2
      },
      {
        _timestamp: "2013-05-01T00:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 2
      },
      {
        _timestamp: "2013-06-01T00:00:00+00:00",
        eventLabel: "fco-transaction-name_end",
        uniqueEvents: 3
      }
    ];
    
    var someFakeFCOTransactionDataNested = [
      { 
        eventLabel: "fco-transaction-name_begin", 
        values: [
          {
            _timestamp: "2013-04-01T00:00:00+00:00",
            uniqueEvents: 5
          },
          {
            _timestamp: "2013-05-01T00:00:00+00:00",
            uniqueEvents: 7
          },
          {
            _timestamp: "2013-06-01T00:00:00+00:00",
            uniqueEvents: 9
          }
        ]
      },
      {
        eventLabel: "fco-transaction-name_end", 
        values: [
          {
            _timestamp: "2013-04-01T00:00:00+00:00",
            uniqueEvents: 2
          },
          {
            _timestamp: "2013-05-01T00:00:00+00:00",
            uniqueEvents: 2
          },
          {
            _timestamp: "2013-06-01T00:00:00+00:00",
            uniqueEvents: 3
          }
        ]
      }
    ];

    describe("FCO volumetrics collections", function () {

      sharedBehaviourForCompletion({
        data: someFakeFCOTransactionDataCategory,
        start_matcher: /start$/,
        start_matcher_suffix: "start",
        end_matcher: /done$/,
        matching_attribute: "eventCategory"
      });

      sharedBehaviourForCompletionWithMissingData({
        data: missingDataCategory,
        start_matcher: /start$/,
        start_matcher_suffix: "start",
        end_matcher: /done$/,
        matching_attribute: "eventCategory"
      });

      sharedBehaviourForCompletion({
        data: someFakeFCOTransactionDataLabel,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel"
      });

      sharedBehaviourForCompletionWithMissingData({
        data: missingDataLabel,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel"
      });
      
      sharedBehaviourForCompletion({
        data: someFakeFCOTransactionDataLabelMonthly,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel", 
        period: "month"
      });
      
      sharedBehaviourForCompletion({
        data: someFakeFCOTransactionDataNested,
        start_matcher: /_begin$/,
        start_matcher_suffix: "_begin",
        end_matcher: /_end$/,
        matching_attribute: "eventLabel", 
        period: "month"
      });

      function sharedBehaviourForCompletion(context) {

        var volumetricsCollection = undefined,
            getMoment,
            collectionFor = function (data) {
              collection = new CompletionRateCollection({}, {
                "data-group": 'notARealFCOTransaction',
                "data-type": 'journey',
                startMatcher: context.start_matcher,
                endMatcher: context.end_matcher,
                matchingAttribute: context.matching_attribute,
                period: context.period
              });
              collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
              return collection;
            };

        beforeEach(function () {
          volumetricsCollection = collectionFor({data: context.data});
        });

        it("should give a series for completion rate", function () {
          var parse = volumetricsCollection.parse({data: context.data});
          expect(parse.title).toBe("Completion rate");
          expect(parse.id).toBe("completion");
          expect(parse.weeks.total).toBe(3);
          expect(parse.weeks.available).toBe(3);
          if (volumetricsCollection.period) {
            expect(parse.totalCompletion).toBeCloseTo(0.333, 1);
          } else { 
            expect(parse.totalCompletion).toBeCloseTo(0.476, 1);
          }
          expect(parse.values.length).not.toBeUndefined();
        });

        it("should map completion rates to completion series", function () {
          if (volumetricsCollection.period) {
            var len = 12;
            var firstValue = volumetricsCollection.parse({data: context.data}).values[len-3];
            expect(firstValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-04-01T02:00:00+01:00"));
            expect(firstValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-05-01T02:00:00+01:00"));
            expect(firstValue.get('completion')).toBe(0.4);
            var secondValue = volumetricsCollection.parse({data: context.data}).values[len-2];
            expect(secondValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-05-01T02:00:00+01:00"));
            expect(secondValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-01T02:00:00+01:00"));
            expect(secondValue.get('completion')).toBeCloseTo(0.286, 1);
            var thirdValue = volumetricsCollection.parse({data: context.data}).values[len-1];
            expect(thirdValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-01T02:00:00+01:00"));
            expect(thirdValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-07-01T02:00:00+01:00"));
            expect(thirdValue.get('completion')).toBeCloseTo(0.333, 1);
          } else { 
            var len = 9;
            var firstValue = volumetricsCollection.parse({data: context.data}).values[len-3];
            expect(firstValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-10T01:00:00+01:00"));
            expect(firstValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-17T01:00:00+01:00"));
            expect(firstValue.get('completion')).toBe(0.6);
            var secondValue = volumetricsCollection.parse({data: context.data}).values[len-2];
            expect(secondValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-17T01:00:00+01:00"));
            expect(secondValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-24T01:00:00+01:00"));
            expect(secondValue.get('completion')).toBeCloseTo(0.428, 1);
            var thirdValue = volumetricsCollection.parse({data: context.data}).values[len-1];
            expect(thirdValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-24T01:00:00+01:00"));
            expect(thirdValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-07-01T01:00:00+01:00"));
            expect(thirdValue.get('completion')).toBeCloseTo(0.4444, 1);
          }
        });

        it("should query for the appropriate number of data items for completion series", function () {
          if (volumetricsCollection.period) { 
            expect(volumetricsCollection.parse({data: context.data}).values.length).toBe(12);
          } else { 
            expect(volumetricsCollection.parse({data: context.data}).values.length).toBe(9);
          }
        });

        it("should pad out missing data for completions series", function () {
          if (!volumetricsCollection.period) { 
            var paddedValue = volumetricsCollection.parse({data: context.data}).values[5];
            expect(paddedValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-03T01:00:00+0100"));
            expect(paddedValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-10T01:00:00+01:00"));
            expect(paddedValue.get('completion')).toBe(null);
          }
        });

        it("should have a completion rate of 0 when there's no done event for the timestamp", function () {
          var data = {_timestamp: "2013-06-09T23:00:00+00:00", uniqueEvents: 5};
          data[context.matching_attribute] = "fco-transaction-name" + context.start_matcher_suffix;

          var events = { data: [
            data
          ]};

          var noDoneEventCompletionRateCollection = function () { 
            collection = new CompletionRateCollection({}, {
              "data-group": 'notARealFCOTransaction',
              "data-type": 'journey',
              startMatcher: context.start_matcher,
              endMatcher: context.end_matcher,
              matchingAttribute: context.matching_attribute
            });
            collection.backdropUrl = '//testdomain/{{ data-group }}/{{ data-type }}';
            return collection;
          }();

          expect(noDoneEventCompletionRateCollection.parse(events).values[8].get('completion')).toBe(0);
        });
      }

      function sharedBehaviourForCompletionWithMissingData(context) {

        var volumetricsCollection = undefined,
            collectionFor = function (data) {
              collection  = new CompletionRateCollection({}, {
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

        it("should ignore missing data for completion rate", function () {
          var parse = volumetricsCollection.parse({data: context.data});

          expect(parse.weeks.total).toBe(3);
          expect(parse.weeks.available).toBe(2);
          expect(parse.totalCompletion).toBeCloseTo(0.5, 1);
        });
        
        it("should have null completion rate for missing data", function () {
          var completionWithMissingData = volumetricsCollection.parse({data: context.data}).values;
          var missingValue = completionWithMissingData[7];

          expect(missingValue.get('_start_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-17T01:00:00+01:00"));
          expect(missingValue.get('_end_at')).toBeMoment(volumetricsCollection.getMoment("2013-06-24T01:00:00+01:00"));
          expect(missingValue.get('completion')).toBe(null);
        });
        
      }

    });
  }
);
