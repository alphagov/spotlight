define([
  'common/views/visualisations/stacked-graph',
  'extensions/collections/collection',
  'extensions/views/graph/stack',
  'extensions/views/graph/stacked-linelabel',
  'extensions/views/graph/callout',
  'extensions/views/graph/graph',
  'extensions/models/model'
],
function (StackedGraph, Collection, Stack, LineLabel, Callout, Graph, Model) {
  describe('StackedGraph', function () {
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
      spyOn(Graph.prototype, 'initialize').andCallThrough();
      var model = new Model({
        'value-attribute': 'someAttr'
      });
      graph = new StackedGraph({
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

    describe('interactiveFunction', function () {
      describe('if graph.lineLabelOnTop() is truthy', function () {
        beforeEach(function () {
          graph.graph = {
            lineLabelOnTop: function () {
              return true;
            }
          };
        });
        it('returns true when the passed in object.slice is >= 3', function () {
          expect(graph.interactiveFunction({slice: 3})).toEqual(true);
        });
        it('returns false when the passed in object.slice is < 3', function () {
          expect(graph.interactiveFunction({slice: 2})).toEqual(false);
        });
      });
      describe('if graph.lineLabelOnTop() is falsy', function () {
        beforeEach(function () {
          graph.graph = {
            lineLabelOnTop: function () {
              return false;
            }
          };
        });
        it('returns true when the passed in object.slice % 3 is !== 2', function () {
          expect(graph.interactiveFunction({slice: 3})).toEqual(true);
        });
        it('returns false when the passed in object.slice % 3 is == 2', function () {
          expect(graph.interactiveFunction({slice: 5})).toEqual(false);
        });
      });
    });

    describe('components', function () {
      describe('when showLineLabels is truthy', function () {
        it('should return the stack component with the correct args on initialize', function () {
          var model = new Model({
            'show-line-labels': true
          });
          graph = new StackedGraph({
            collection: new Collection(),
            model: model
          });
          var stackComponent = graph.components()[2]['view'];
          var stackOptions = graph.components()[2]['options'];
          expect(stackOptions).not.toBeUndefined();
          expect(stackComponent).toEqual(Stack);
        });
      });
      describe('when showLineLabels is falsy', function () {
        it('should return the stack component with the correct args on initialize', function () {
          var stackComponent = graph.components()[2]['view'];
          var stackOptions = graph.components()[2]['options'];
          expect(stackOptions).toBeUndefined();
          expect(stackComponent).toEqual(Stack);
        });
      });

      describe('when showLineLabels is truthy', function () {
        it('should return the linelabel component with the correct args on initialize', function () {
          var model = new Model({
            'show-line-labels': true,
            'line-label-links': true
          });
          graph = new StackedGraph({
            collection: new Collection(),
            model: model
          });
          var labelComponent = graph.components()[3]['view'];
          var labelOptions = graph.components()[3]['options'];
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
      describe('when showLineLabels is falsy', function () {
        it('should return the callout component with the correct args on initialize', function () {
          var labelComponent = graph.components()[3]['view'];
          var labelOptions = graph.components()[3]['options'];
          expect(labelOptions).toBeUndefined();
          expect(labelComponent).toEqual(Callout);
        });
      });
    });

    describe('getConfigNames', function () {
      it('returns configuration for week by default', function () {
        expect(graph.getConfigNames()).toEqual(['stack', 'week']);
      });

      it('returns configuration for day when query period is for day', function () {
        var graph = new StackedGraph({
          collection: collectionForPeriod('day')
        });

        expect(graph.getConfigNames()).toEqual(['stack', 'day']);
      });

      it('returns configuration for when axis period is set', function () {
        var collection = new Collection([], { axisPeriod: 'month' });
        var graph = new StackedGraph({ collection: collection });

        expect(graph.getConfigNames()).toEqual(['stack', 'month']);
      });
    });
  });
});
