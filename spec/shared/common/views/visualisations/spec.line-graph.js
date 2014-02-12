define([
  'common/views/visualisations/line-graph',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (LineGraph, Collection, Model) {

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
        'value-attr': "someAttr"
      });

  beforeEach(function () {
    graph = new LineGraph({
      collection: new Collection(),
      model: model
    })
  });

  describe("configuration", function () {
    it("get the valueAttr from the model on initialize", function () {
      expect(graph.valueAttr).toEqual("someAttr");
    });
  });

  describe("getConfigNames", function () {
    it("returns configuration for week by default", function () {
      expect(graph.getConfigNames()).toEqual(['overlay', 'week']);
    });

    it("returns configuration for day when query period is for day", function () {
      var graph = new LineGraph({
        model: model,
        collection: collectionForPeriod('day')
      });

      expect(graph.getConfigNames()).toEqual(['overlay', 'day']);
    });

    it("returns configuration for when axis period is set", function () {
      var collection = new Collection([], { axisPeriod: 'month' });
      var graph = new LineGraph({ model: model, collection: collection });

      expect(graph.getConfigNames()).toEqual(['overlay', 'month']);
    });
  });

});
