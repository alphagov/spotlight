define([
  'common/views/visualisations/line-graph',
  'extensions/views/graph/graph',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (LineGraph, Graph, Collection, Model) {
  describe('LineGraph', function () {

    var graph,
      model = new Model({
        'value-attribute': 'someAttr'
      });

    beforeEach(function () {
      spyOn(Graph.prototype, 'initialize').andCallThrough();
      graph = new LineGraph({
        collection: new Collection(),
        model: model
      });
    });

    describe('configuration', function () {
      it('get the valueAttr from the model on initialize', function () {
        expect(graph.valueAttr).toEqual('someAttr');
      });
      it('passes valueAttr option to base graph view', function () {
        expect(Graph.prototype.initialize).toHaveBeenCalledWith(jasmine.objectContaining({
          valueAttr: 'someAttr'
        }));
      });
    });

  });

});
