define([
  'extensions/views/graph/stacked-linelabel',
  'extensions/collections/collection'
],
function (LineLabel, Collection) {

  describe('Stacked Line Label Component', function () {

    var el, wrapper, lineLabel, collection, graph;
    beforeEach(function () {

      collection = new Collection([
        { _count: 1 }
      ]);

      graph = {
        innerWidth: 400,
        valueAttr: '_count',
        getLines: function () {
          return [
            { label: 'Title 1', key: '_count' }
          ];
        },
        isOneHundredPercent: function () {
          return false;
        },
        getYPos: function (i) { return i * 10; },
        getY0Pos: function (i) { return i * 5 }
      };

      el = $('<div></div>').appendTo($('body'));
      wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');

      lineLabel = new LineLabel({
        collection: collection
      });
      lineLabel.wrapper = wrapper;
      lineLabel.offset = 100;
      lineLabel.linePaddingInner = 20;
      lineLabel.linePaddingOuter = 30;
      lineLabel.graph = graph;
      lineLabel.margin = {
        top: 100,
        right: 200,
        bottom: 300,
        left: 400
      };
    });

    afterEach(function () {
      el.remove();
    });

    describe('getYIdeal', function () {

      beforeEach(function () {
        spyOn(lineLabel.graph, 'getYPos').andCallThrough();
        spyOn(lineLabel.graph, 'getY0Pos').andCallThrough();
      });

      it('attempts to centre label in stack', function () {
        var result = lineLabel.getYIdeal(1, 'foo');
        expect(lineLabel.graph.getYPos).toHaveBeenCalledWith(1, 'foo');
        expect(lineLabel.graph.getY0Pos).toHaveBeenCalledWith(1, 'foo');
        expect(result).toEqual(7.5);
      });

    });

  });

});
