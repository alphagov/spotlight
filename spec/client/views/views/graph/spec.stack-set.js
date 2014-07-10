define([
  'extensions/views/graph/stack-set',
  'extensions/views/graph/stack',
  'extensions/views/graph/component',
  'common/collections/grouped_timeseries'
], function (StackSet, Stack, Component, Collection) {

  describe('Stack Set', function () {

    var stackset, graph, collection;

    beforeEach(function () {
      collection = new Collection();
      graph = {
        getLines: function () {
          return [
            { key: 'foo' },
            { key: 'bar' }
          ];
        },
        getDefaultComponentOptions: function () {
          return {
            graph: graph,
            collection: collection
          };
        }
      };
    });

    describe('initialize', function () {

      it('calls up to component initialize', function () {
        spyOn(Component.prototype, 'initialize').andCallThrough();
        stackset = new StackSet({
          graph: graph,
          collection: collection
        });
        expect(Component.prototype.initialize).toHaveBeenCalledWith({
          graph: graph,
          collection: collection
        });
      });

      it('creates a stack for each line', function () {
        stackset = new StackSet({
          graph: graph,
          collection: collection
        });
        expect(stackset.lines.length).toEqual(2);
        _.each(stackset.lines, function (stack) {
          expect(stack instanceof Stack).toBe(true);
        });
      });

      it('sets classNames and valueAttrs on lines', function () {
        stackset = new StackSet({
          graph: graph,
          collection: collection
        });
        var lines = graph.getLines();
        _.each(stackset.lines, function (stack, i) {
          expect(stack.valueAttr).toEqual(lines[i].key);
          expect(stack.className).toEqual('group' + i);
        });
      });

      it('passes a "grouped" property to stacks', function () {
        stackset = new StackSet({
          graph: graph,
          collection: collection
        });
        _.each(stackset.lines, function (stack) {
          expect(stack.grouped).toEqual(true);
        });
      });

    });

  });

});