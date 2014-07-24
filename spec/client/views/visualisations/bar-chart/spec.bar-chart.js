define([
  'common/views/visualisations/bar-chart/bar-chart',
  'extensions/views/graph/graph',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (BarChart, Graph, Collection, Model) {

  describe('BarChart', function () {
    var graph;

    beforeEach(function () {
      graph = new BarChart({
        collection: new Collection(),
        formatOptions: { 'type': 'integer', 'magnitude': 'true' },
        model: new Model()
      });
    });

    describe('calcXScale', function () {

      it('sets the domain to the number of steps', function () {

        graph.collection.reset([
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 }
        ]);
        expect(graph.calcXScale().domain()).toEqual([0, 2]);

        graph.collection.reset([
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 },
          { uniqueEvents: 100 }
        ]);
        expect(graph.calcXScale().domain()).toEqual([0, 3]);
      });
    });

    describe('getYPos', function () {
      it('returns 0 if model data is undefined', function () {
        spyOn(Graph.prototype, 'getYPos');
        expect(graph.getYPos(0)).toEqual(0);
      });
    });

  });

});
