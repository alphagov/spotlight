define([
  'extensions/views/graph/stack-set',
  'extensions/views/graph/stack',
  'extensions/views/graph/component',
  'common/collections/grouped_timeseries'
], function (StackSet, Stack, Component, Collection) {

  describe('Stack Set', function () {

    var stackset, graph, collection;

    beforeEach(function () {
      collection = new Collection([
        { foo: 1, bar: 2 },
        { foo: 2, bar: 4 },
        { foo: 3, bar: 6 },
        { foo: 4, bar: 8 }
      ]);
      graph = {
        getXPos: _.identity,
        getYPos: function (index, attr) {
          return collection.at(index).get(attr) + this.getY0Pos(index, attr);
        },
        getY0Pos: function (index, attr) {
          return attr === 'foo' ? collection.at(index).get('bar') : 0;
        },
        getLines: function () {
          return [
            {
              key: 'foo',
              x: _.identity,
              y: _.identity
            },
            {
              key: 'bar',
              x: _.identity,
              y: _.identity
            }
          ];
        },
        getDefaultComponentOptions: function () {
          return {
            graph: graph,
            collection: collection,
            scales: {
              x: _.identity,
              y: function (y) {
                // y values in real life are 0 at the top
                return 15 - y;
              }
            }
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

    describe('onHover', function () {

      var e;

      beforeEach(function () {
        spyOn(Stack.prototype, 'x').andCallFake(_.identity);
        e = {
          slice: 4,
          x: 1,
          y: 1
        };
        stackset = new StackSet({
          graph: graph,
          collection: collection
        });
        spyOn(collection, 'selectItem');
      });

      it('calls collection selectItem method with the closest model index', function () {
        stackset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(1, jasmine.any(Object));

        e.x = 3;
        stackset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(3, jasmine.any(Object));
      });

      it('does not select item if cursor is over linelabel area', function () {
        e.slice = 5; // 5 represents line labels section
        stackset.onHover(e);
        expect(collection.selectItem).not.toHaveBeenCalled();
      });

      it('passes the valueAttr of the stack encompassing the cursor as an option', function () {
        e.y = 10;
        stackset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(1, { valueAttr: 'foo', force: true });

        e.y = 12;
        stackset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(1, { valueAttr: 'bar', force: true });
      });

      it('passes a null valueAttr if no line has a value at the closest index', function () {
        collection.at(3).set({ foo: null, bar: null });

        e.y = 12;
        e.x = 3;
        stackset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(3, { valueAttr: null, force: true });
      });

    });

  });

});