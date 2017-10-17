define([
  'client/views/graph/line-set',
  'client/views/graph/line',
  'client/views/graph/component',
  'common/collections/grouped_timeseries'
], function (LineSet, Line, Component, Collection) {

  describe('Line Set', function () {

    var lineset, graph, collection;

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
          return collection.at(index).get(attr);
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
              y: _.identity
            }
          };
        }
      };
    });

    describe('initialize', function () {

      it('calls up to component initialize', function () {
        spyOn(Component.prototype, 'initialize').and.callThrough();
        lineset = new LineSet({
          graph: graph,
          collection: collection
        });
        /*
        Note:
        because of variable hoisting, we have to include the `el: undefined`
        argument in the expectation.
        The base Backbone.View object adds an "el" key to the passed-in 'options'
        argument at the very end of the View::initialize method, which jasmine
        then sees as part of the initial argument passed to the View object.

        So we have to "expect" that an `el: undefined` argument was passed,
        whether it was or not
        */
        expect(Component.prototype.initialize).toHaveBeenCalledWith({
          graph: graph,
          collection: collection,
          el: undefined
        });
      });

      it('creates a line component for each line', function () {
        lineset = new LineSet({
          graph: graph,
          collection: collection
        });
        expect(lineset.lines.length).toEqual(2);
        _.each(lineset.lines, function (line) {
          expect(line instanceof Line).toBe(true);
        });
      });

      it('sets classNames and valueAttrs on lines', function () {
        lineset = new LineSet({
          graph: graph,
          collection: collection
        });
        var lines = graph.getLines();
        _.each(lineset.lines, function (line, i) {
          expect(line.valueAttr).toEqual(lines[i].key);
          expect(line.className).toEqual('group' + i);
        });
      });

      it('passes a "grouped" property to lines', function () {
        lineset = new LineSet({
          graph: graph,
          collection: collection
        });
        _.each(lineset.lines, function (line) {
          expect(line.grouped).toEqual(true);
        });
      });

    });

    describe('onHover', function () {

      var e;

      beforeEach(function () {
        spyOn(Line.prototype, 'x').and.callFake(_.identity);
        e = {
          slice: 4,
          x: 1,
          y: 1
        };
        lineset = new LineSet({
          graph: graph,
          collection: collection
        });
        spyOn(collection, 'selectItem');
      });

      it('calls collection selectItem method with the closest model index', function () {
        lineset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(1, jasmine.any(Object));

        e.x = 3;
        lineset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(3, jasmine.any(Object));
      });

      it('does not select item if cursor is over linelabel area', function () {
        e.slice = 5; // 5 represents line labels section
        lineset.onHover(e);
        expect(collection.selectItem).not.toHaveBeenCalled();
      });

      it('passes the valueAttr of the closest line as an option', function () {
        e.y = 1;
        lineset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(1, { valueAttr: 'foo', force: true });

        e.y = 5;
        lineset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(1, { valueAttr: 'bar', force: true });
      });

      it('passes a null valueAttr if no line has a value at the closest index', function () {
        collection.at(3).set({ foo: null, bar: null });

        e.x = 3;
        lineset.onHover(e);
        expect(collection.selectItem).toHaveBeenCalledWith(3, { valueAttr: null, force: true });
      });

      it('interpolates between lines if x value is between two points', function () {
        collection.at(3).set('bar', 34);

        e.x = 2.4;
        e.y = 10;
        lineset.onHover(e);
        /* if we used purely "closest point" then this would return the
         * "bar" line at (2, 6) but because it slopes up so sharply then
         * the closest line at x=2.4 is the "foo" line
         * the interpolated mid-point between the lines at x=2.4 is y=15
         */
        expect(collection.selectItem).toHaveBeenCalledWith(2, { valueAttr: 'foo', force: true });
      });

    });

  });

});
