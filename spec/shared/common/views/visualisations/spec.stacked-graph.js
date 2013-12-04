define([
  'common/views/visualisations/stacked-graph',
  'extensions/collections/collection',
  'extensions/views/graph/stack',
  'extensions/views/graph/linelabel',
  'extensions/views/graph/callout',
  'extensions/models/model'
],
function (StackedGraph, Collection, Stack, LineLabel, Callout, Model) {

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

  var graph;
  beforeEach(function () {
    model = new Model();
    model.set({'value-attr': "someAttr"});
    graph = new StackedGraph({
      collection: new Collection(),
      model: model
    })
  });

  describe("configuration", function () {
    it("get the valueAttr from the model on initialize", function () {
      expect(graph.valueAttr).toEqual("someAttr");
    });
  });

  describe("interactiveFunction", function () {
    describe("if graph.lineLabelOnTop() is truthy", function () {
      beforeEach(function (){
        graph.graph = {
          lineLabelOnTop: function () {
            return true;
          }
        }
      });
      it("returns true when the passed in object.slice is >= 3", function () {
        expect(graph.interactiveFunction({slice: 3})).toEqual(true);
      });
      it("returns false when the passed in object.slice is < 3", function () {
        expect(graph.interactiveFunction({slice: 2})).toEqual(false);
      });
    });
    describe("if graph.lineLabelOnTop() is falsy", function () {
      beforeEach(function (){
        graph.graph = {
          lineLabelOnTop: function () {
            return false;
          }
        }
      });
      it("returns true when the passed in object.slice % 3 is !== 2", function () {
        expect(graph.interactiveFunction({slice: 3})).toEqual(true);
      });
      it("returns false when the passed in object.slice % 3 is == 2", function () {
        expect(graph.interactiveFunction({slice: 5})).toEqual(false);
      });
    });
  });

  describe("components", function () {
    describe("when showLineLabels is truthy", function () {
      it("should return the stack component with the correct args on initialize", function (){
        model = new Model();
        model.set({'show-line-labels': true});
        graph = new StackedGraph({
          collection: new Collection(),
          model: model
        });
        stackComponent = graph.components()[2]["view"];
        stackOptions = graph.components()[2]["options"];
        expect(stackOptions).not.toBeUndefined();
        expect(stackComponent).toEqual(Stack);
      });
    });
    describe("when showLineLabels is falsy", function () {
      it("should return the stack component with the correct args on initialize", function (){
        stackComponent = graph.components()[2]["view"];
        stackOptions = graph.components()[2]["options"];
        expect(stackOptions).toBeUndefined();
        expect(stackComponent).toEqual(Stack);
      });
    });

    describe("when showLineLabels is truthy", function () {
      it("should return the linelabel component with the correct args on initialize", function (){
        model = new Model();
        model.set({'show-line-labels': true});
        model.set({'line-label-links': true});
        graph = new StackedGraph({
          collection: new Collection(),
          model: model
        });
        labelComponent = graph.components()[3]["view"];
        labelOptions = graph.components()[3]["options"];
        expect(labelOptions).toEqual({
          showValues: true,
          showValuesPercentage: true,
          showSummary: true,
          showTimePeriod: true,
          attachLinks: model.get('line-label-links')
        });
        expect(labelComponent).toEqual(LineLabel);
      });
    });
    describe("when showLineLabels is falsy", function () {
      it("should return the callout component with the correct args on initialize", function (){
        labelComponent = graph.components()[3]["view"];
        labelOptions = graph.components()[3]["options"];
        expect(labelOptions).toBeUndefined();
        expect(labelComponent).toEqual(Callout);
      });
    });
  });

  describe("getConfigNames", function () {
    it("returns configuration for week by default", function () {
      expect(graph.getConfigNames()).toEqual(['stack', 'week']);
    });

    it("returns configuration for day when query period is for day", function () {
      var graph = new StackedGraph({
        collection: collectionForPeriod('day'),
        model: new Model()
      });

      expect(graph.getConfigNames()).toEqual(['stack', 'day']);
    });
  });
});
