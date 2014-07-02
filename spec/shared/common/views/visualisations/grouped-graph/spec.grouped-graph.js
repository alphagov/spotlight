define([
  'common/views/visualisations/grouped-graph/grouped-graph',
  'extensions/collections/collection'
], function (Graph, Collection) {

  describe('Grouped Graph', function () {

    var graph, collection;

    beforeEach(function () {
      collection = new Collection();
      Graph.prototype.GroupClass = function () {};
      graph = new Graph({
        collection: collection,
        valueAttr: 'events'
      });
    });

    describe('calcYScale', function () {

      it('scales domain from 0 to 1 when this is a percentage graph', function () {
        graph.isOneHundredPercent = function () { return true; };
        expect(graph.calcYScale().domain()).toEqual([0, 1]);
      });

    });


  });


});