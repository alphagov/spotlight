define([
  'common/views/visualisations/bar-chart/bar-chart',
  'extensions/views/graph/graph',
  'common/collections/journey',
  'extensions/collections/collection'
],
function (BarChart, Graph, JourneyCollection, Collection) {

  describe('BarChart', function () {
    var graph;

    beforeEach(function () {
      graph = new BarChart({
        collection: new JourneyCollection([{}]),
        formatOptions: { 'type': 'integer', 'magnitude': 'true' }
      });
    });

    describe('calcXScale', function () {
      it('sets the domain to the number of steps', function () {

        graph.collection.at(0).set('values', new Collection([
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 }
        ]));
        expect(graph.calcXScale().domain()).toEqual([0, 2]);

        graph.collection.at(0).set('values', new Collection([
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 }
        ]));
        expect(graph.calcXScale().domain()).toEqual([0, 3]);
      });
    });

    describe('getYPos', function () {
      it('returns 0 if model data is undefined', function () {
        spyOn(Graph.prototype, 'getYPos');
        expect(graph.getYPos(0, 0)).toEqual(0);
      });
    });

  });

});
