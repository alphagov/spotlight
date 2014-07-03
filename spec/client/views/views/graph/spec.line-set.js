define([
  'extensions/views/graph/line-set',
  'extensions/views/graph/line',
  'extensions/views/graph/component',
  'common/collections/grouped_timeseries'
], function (LineSet, Line, Component, Collection) {

  describe('Line Set', function () {

    var lineset, graph, collection;

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
        lineset = new LineSet({
          graph: graph,
          collection: collection
        });
        expect(Component.prototype.initialize).toHaveBeenCalledWith({
          graph: graph,
          collection: collection
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

    });

  });

});