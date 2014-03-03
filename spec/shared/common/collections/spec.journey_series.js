define([
  'common/collections/journey_series'
], function(JourneySeriesCollection) {
  describe("JourneySeriesCollection", function() {
    var TestCollection;
    beforeEach(function() {
      TestCollection = JourneySeriesCollection.extend({
        axes: {
          y: [
            {
              journeyId: 'example:downloadFormPage',
              label: 'A',
              key: 'uniqueEvents'
            },
            {
              journeyId: 'example:submitApplicationPage',
              label: 'B',
              key: 'uniqueEvents'
            },
            {
              journeyId: 'example:end',
              label: 'C',
              key: 'uniqueEvents'
            }
          ]
        },
      });

      this.addMatchers({
        toHaveStartAndEndDatesMatching: function(startDate, endDate) {
          return this.actual.start_at.format('YYYY-MM-DDTHH:mm:ss') === startDate &&
            this.actual.end_at.format('YYYY-MM-DDTHH:mm:ss') === endDate;
        }
      });
    });

    describe("initialize", function () {
      it("allows setting axes from the constructor", function () {
        var collection = new JourneySeriesCollection([], {
          axes: {
            y: [
              { journeyId: 'example:downloadFormPage', label: 'A', key: 'uniqueEvents' }
            ]
          }
        });

        expect(collection.axes).toEqual({
          y: [
            { journeyId: 'example:downloadFormPage', label: 'A', key: 'uniqueEvents' }
          ]
        });
      });
    });

    describe("queryParams", function() {

      it("requests data for the last week by default", function() {
        var collection = new TestCollection();

        jasmine.setupMoment('2013-03-13T00:00:00+00:00', collection);

        var params = collection.queryParams();
        expect(params).toHaveStartAndEndDatesMatching('2013-03-04T00:00:00', '2013-03-11T00:00:00');
      });

      it("requests data for an earlier week", function() {
        var collection = new TestCollection(null, {
          weeksAgo: 1
        });

        jasmine.setupMoment('2013-03-13', collection);

        var params = collection.queryParams();
        expect(params).toHaveStartAndEndDatesMatching('2013-02-25T00:00:00', '2013-03-04T00:00:00');
      });

      describe("Monday to Sunday week boundaries", function () {
        describe("Sundays", function () {
          it("should start the query 13 days before and finish 6 days before - by default", function () {
            var conversionCollection = new TestCollection();
            jasmine.setupMoment('2013-07-14T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params).toHaveStartAndEndDatesMatching('2013-07-01T00:00:00', '2013-07-08T00:00:00');
          });

          it("should start the query 20 days before and finish 13 days before - for 1 week ago", function () {
            var conversionCollection = new TestCollection(null, {
              weeksAgo: 1
            });
            jasmine.setupMoment('2013-07-14T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params).toHaveStartAndEndDatesMatching('2013-06-24T00:00:00', '2013-07-01T00:00:00');
          });
        });

        describe("Mondays", function () {
          it("should start the query 7 days before and finish 0 days before - by default", function () {
            var conversionCollection = new TestCollection();
            jasmine.setupMoment('2013-07-15T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params).toHaveStartAndEndDatesMatching('2013-07-08T00:00:00', '2013-07-15T00:00:00');
          });

          it("should start the query 14 days before and finish 7 days before - for 1 week ago", function () {
            var conversionCollection = new TestCollection(null, {
              weeksAgo: 1
            });
            jasmine.setupMoment('2013-07-15T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params).toHaveStartAndEndDatesMatching('2013-07-01T00:00:00', '2013-07-08T00:00:00');
          });
        });

        describe("Saturdays", function () {
          it("should start the query 12 days before and finish 5 days before - by default", function () {
            var conversionCollection = new TestCollection();
            jasmine.setupMoment('2013-07-13T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params).toHaveStartAndEndDatesMatching('2013-07-01T00:00:00', '2013-07-08T00:00:00');
          });

          it("should start the query 19 days before and finish 12 days before - for 1 week ago", function () {
            var conversionCollection = new TestCollection(null, {
              weeksAgo: 1
            });
            jasmine.setupMoment('2013-07-13T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params).toHaveStartAndEndDatesMatching('2013-06-24T00:00:00', '2013-07-01T00:00:00');
          });
        });
      });

      describe("Monday to Sunday week boundaries", function () {
        describe("Sundays", function () {
          it("should start the query 13 days before and finish 6 days before - by default", function () {
            var conversionCollection = new TestCollection();
            jasmine.setupMoment('2013-07-14T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-01T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-08T00:00:00');
          });

          it("should start the query 20 days before and finish 13 days before - for 1 week ago", function () {
            var conversionCollection = new TestCollection(null, {
              weeksAgo: 1
            });
            jasmine.setupMoment('2013-07-14T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-06-24T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-01T00:00:00');
          });
        });

        describe("Mondays", function () {
          it("should start the query 7 days before and finish 0 days before - by default", function () {
            var conversionCollection = new TestCollection();
            jasmine.setupMoment('2013-07-15T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-08T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-15T00:00:00');
          });

          it("should start the query 14 days before and finish 7 days before - for 1 week ago", function () {
            var conversionCollection = new TestCollection(null, {
              weeksAgo: 1
            });
            jasmine.setupMoment('2013-07-15T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-01T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-08T00:00:00');
          });
        });

        describe("Saturdays", function () {
          it("should start the query 12 days before and finish 5 days before - by default", function () {
            var conversionCollection = new TestCollection();
            jasmine.setupMoment('2013-07-13T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-01T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-08T00:00:00');
          });

          it("should start the query 19 days before and finish 12 days before - for 1 week ago", function () {
            var conversionCollection = new TestCollection(null, {
              weeksAgo: 1
            });
            jasmine.setupMoment('2013-07-13T00:00:00+00:00', conversionCollection);

            var params = conversionCollection.queryParams();
            expect(params.start_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-06-24T00:00:00');
            expect(params.end_at.format('YYYY-MM-DDTHH:mm:ss')).toEqual('2013-07-01T00:00:00');
          });
        });
      });
    });

    describe("parse", function () {
      it("should not change order if they follow the specified sort order", function() {
        var models = [
          {stepAttr: "example:downloadFormPage", uniqueEvents: 54321},
          {stepAttr: "example:submitApplicationPage", uniqueEvents: 4321},
          {stepAttr: "example:end", uniqueEvents: 321}
        ];
        var collection = new TestCollection(models, {parse: true});

        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(1).get('step')).toEqual("example:submitApplicationPage");
        expect(collection.at(2).get('step')).toEqual("example:end");
      });

      it("should reorder according to a provided sort order", function() {
        var models = [
          {stepAttr: "example:submitApplicationPage", uniqueEvents: 4321},
          {stepAttr: "example:downloadFormPage", uniqueEvents: 54321},
          {stepAttr: "example:end", uniqueEvents: 321}
        ];
        var collection = new TestCollection(models, {parse: true});

        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(1).get('step')).toEqual("example:submitApplicationPage");
        expect(collection.at(2).get('step')).toEqual("example:end");
      });

      it("should not include unrecognised keys", function() {
        var models = [
          {stepAttr: "afly_1", uniqueEvents: 4321},
          {stepAttr: "example:downloadFormPage", uniqueEvents: 54321},
          {stepAttr: "example:submitApplicationPage", uniqueEvents: 321},
          {stepAttr: "example:end", uniqueEvents: 3211}
        ];
        var collection = new TestCollection(models, {parse: true});

        expect(collection.length).toEqual(3);
        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(1).get('step')).toEqual("example:submitApplicationPage");
        expect(collection.at(2).get('step')).toEqual("example:end");
      });

      it("adds a normalised fraction of unique events for each step", function () {
        var models = [
          {stepAttr: "example:downloadFormPage", uniqueEvents: 50000},
          {stepAttr: "example:submitApplicationPage", uniqueEvents: 25000},
          {stepAttr: "example:end", uniqueEvents: 10000}
        ];
        var collection = new TestCollection(null, { matchingAttribute: 'stepAttr' });
        collection.reset(collection.parse({ data: models }));

        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(0).get('uniqueEventsNormalised')).toEqual(1);
        expect(collection.at(1).get('step')).toEqual("example:submitApplicationPage");
        expect(collection.at(1).get('uniqueEventsNormalised')).toEqual(0.5);
        expect(collection.at(2).get('step')).toEqual("example:end");
        expect(collection.at(2).get('uniqueEventsNormalised')).toEqual(0.2);
      });

      it("deals with missing steps in the response", function () {
        var models = [];
        var collection = new TestCollection(null, { matchingAttribute: 'stepAttr' });
        collection.reset(collection.parse({ data: models }));

        expect(collection.length).toEqual(3);
        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(0).get('uniqueEvents')).toEqual(0);
        expect(collection.at(0).get('uniqueEventsNormalised')).toEqual(0);
        expect(collection.at(1).get('step')).toEqual("example:submitApplicationPage");
        expect(collection.at(1).get('uniqueEvents')).toEqual(0);
        expect(collection.at(1).get('uniqueEventsNormalised')).toEqual(0);
        expect(collection.at(2).get('step')).toEqual("example:end");
        expect(collection.at(2).get('uniqueEvents')).toEqual(0);
        expect(collection.at(2).get('uniqueEventsNormalised')).toEqual(0);
      });

      it("assigns step from a configurable property", function() {
        var models = [
          {customStep: "example:downloadFormPage", uniqueEvents: 50000},
          {customStep: "example:submitApplicationPage", uniqueEvents: 25000},
          {customStep: "example:end", uniqueEvents: 10000}
        ];

        var collection = new TestCollection(null, { matchingAttribute: 'customStep' });
        collection.reset(collection.parse({ data: models }));

        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(0).get('uniqueEvents')).toEqual(50000);
      });

      it("defaults to eventCategory when no step is configured", function() {
        var models = [
          {eventCategory: "example:downloadFormPage", uniqueEvents: 50000},
          {eventCategory: "example:submitApplicationPage", uniqueEvents: 25000},
          {eventCategory: "example:end", uniqueEvents: 10000}
        ];

        var collection = new TestCollection(null);
        collection.reset(collection.parse({ data: models }));

        expect(collection.at(0).get('step')).toEqual("example:downloadFormPage");
        expect(collection.at(0).get('uniqueEvents')).toEqual(50000);
      });
    });
  });
});
