define([
  'common/views/visualisations/line-graph',
  'extensions/views/graph/graph',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (LineGraph, Graph, Collection, Model) {
  describe('LineGraph', function () {
    function collectionForPeriod(period) {
      var CollectionWithPeriod =  Collection.extend({
        queryParams: function () {
          return {
            period: period
          };
        }
      });

      return new CollectionWithPeriod();
    }

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

    describe('getConfigNames', function () {
      it('returns configuration for week by default', function () {
        expect(graph.getConfigNames()).toEqual(['week']);
      });

      it('returns configuration for day when query period is for day', function () {
        var graph = new LineGraph({
          model: model,
          collection: collectionForPeriod('day')
        });

        expect(graph.getConfigNames()).toEqual(['day']);
      });

      it('returns configuration for when axis period is set', function () {
        var collection = new Collection([], { axisPeriod: 'month' });
        var graph = new LineGraph({ model: model, collection: collection });

        expect(graph.getConfigNames()).toEqual(['month']);
      });
    });
  });

});
