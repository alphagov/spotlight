define([
  'common/views/visualisations/journey-graph/journey-graph',
  'common/collections/journey_series'
],
function (JourneyGraph, JourneyCollection) {

  describe('JourneyGraph', function () {
    var graph;

    beforeEach(function () {
      graph = new JourneyGraph({
        collection: new JourneyCollection()
      });
      graph.valueAttr = 'uniqueEvents';
    });

    describe('calcYScale', function () {

      describe('domain', function () {

        it('is set to [0,1] if there is no data', function () {
          expect(graph.calcYScale().domain()).toEqual([0, 1]);
        });

        it('is set to the range of the data', function () {
          graph.collection.reset([
            { uniqueEvents: 137 },
            { uniqueEvents: 100 }
          ]);
          expect(graph.calcYScale().domain()).toEqual([0, 137]);
        });

      });
    });

  });

});
