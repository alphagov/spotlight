define([
  'client/views/graph/stack',
  'extensions/collections/collection'
],
function (Stack, Collection) {
  describe('Stack component', function () {
    var el, wrapper, collection, graph;
    var d3 = Stack.prototype.d3;
    beforeEach(function () {
      el = $('<div></div>').appendTo($('body'));
      wrapper = d3.select(el[0]).append('svg').append('g');
      collection = new Collection([
        { 'a:count': 1, 'b:count': 2, 'total:count': 3 },
        { 'a:count': 4, 'b:count': 5, 'total:count': 9 },
        { 'a:count': 7, 'b:count': 8, 'total:count': 15 },
        { 'a:count': 9, 'b:count': 10, 'total:count': 19 },
        { 'a:count': 11, 'b:count': 12, 'total:count': 23 }
      ]);

      graph = {
        getXPos: function (index) {
          return index;
        },
        getYPos: function (index, attr) {
          return collection.at(index) ? collection.at(index).get(attr) : null;
        },
        getY0Pos: function () {
          return 0;
        },
        innerHeight: 100,
        innerWidth: 200
      };

    });

    afterEach(function () {
      el.remove();
    });

    describe('render', function () {

      var view;
      beforeEach(function () {
        view = new Stack({
          interactive: false,
          wrapper: wrapper,
          collection: collection,
          scales: {
            x: function (x) {
              return x;
            },
            y: function (y) {
              return y;
            }
          },
          graph: graph,
          valueAttr: 'a:count'
        });
      });

      it('renders a stack consisting of a stroked path and a filled path for each item in the collection', function () {
        view.render();
        var coords = _.map(collection.pluck('a:count'), function (y, i) {
          return (i + 0.5) + ',' + (y);
        });
        var line = 'M' + coords.join('L');
        expect(wrapper.selectAll('path.line').attr('d')).toEqual(line);
        var basecoords = _.map([5, 4, 3, 2, 1], function (x) {
          return (x - 0.5) + ',0';
        });
        var stackLine = 'M' + [].concat(coords, basecoords).join('L') + 'Z';
        expect(wrapper.selectAll('path.stack').attr('d')).toEqual(stackLine);
      });

      it('renders multiple paths when there are gaps in the data', function () {
        collection.at(2).set('a:count', null);
        view.render();
        expect(wrapper.selectAll('path.line').attr('d')).toEqual('M0.5,1L1.5,4M3.5,9L4.5,11');
        expect(wrapper.selectAll('path.stack').attr('d')).toEqual('M0.5,1L1.5,4L1.5,0L0.5,0ZM3.5,9L4.5,11L4.5,0L3.5,0Z');
      });

      it('puts the bottom of the stack along the baseline provided by the graph', function () {
        graph.getY0Pos = function (index) {
          return index;
        };
        view.render();
        var coords = _.map(collection.pluck('a:count'), function (y, i) {
          return (i + 0.5) + ',' + y;
        });
        var basecoords = _.map([4, 3, 2, 1, 0], function (x) {
          return (x + 0.5) + ',' + x;
        });
        var stackLine = 'M' + [].concat(coords, basecoords).join('L') + 'Z';
        expect(wrapper.selectAll('path.stack').attr('d')).toEqual(stackLine);
      });

      it('scales x&y values appropriately using scale functions provided', function () {
        view.scales = {
          x: function (x) {
            return 2 * x;
          },
          y: function (y) {
            return 3 * y;
          }
        };
        view.render();
        var coords = _.map(collection.pluck('a:count'), function (y, i) {
          return ((2 * i) + 0.5) + ',' + (3 * y);
        });
        var line = 'M' + coords.join('L');
        expect(wrapper.selectAll('path.line').attr('d')).toEqual(line);
        var basecoords = _.map([4, 3, 2, 1, 0], function (x) {
          return ((2 * x) + 0.5) + ',0';
        });
        var stackLine = 'M' + [].concat(coords, basecoords).join('L') + 'Z';
        expect(wrapper.selectAll('path.stack').attr('d')).toEqual(stackLine);
      });

    });

    describe('onChangeSelected', function () {

      describe('when not grouped', function () {

        var view;
        beforeEach(function () {
          view = new Stack({
            interactive: false,
            wrapper: wrapper,
            collection: collection,
            scales: {
              x: function (x) {
                return x;
              },
              y: function (y) {
                return y;
              }
            },
            graph: graph,
            valueAttr: 'a:count'
          });
        });

        it('adds a selected class to line', function () {
          view.render();
          view.onChangeSelected(collection.at(0), 0);
          expect(wrapper.select('path.line').attr('class').split(' ')).toContain('selected');
          expect(wrapper.select('path.stack').attr('class').split(' ')).toContain('selected');
        });

        it('does not render a highlighted cursor line', function () {
          view.render();
          view.onChangeSelected(collection.at(0), 0);
          expect(wrapper.selectAll('.cursorLine.selected')[0].length).toEqual(0);
        });

        it('does not render an extra selection point', function () {
          view.render();
          view.onChangeSelected(collection.at(3), 3);
          expect(wrapper.selectAll('.selectedIndicator')[0].length).toEqual(1);
          var c1 = d3.select(wrapper.selectAll('.selectedIndicator')[0][0]);
          expect(c1.attr('cy')).toEqual('9');
        });


      });

      describe('when grouped', function () {

        var view;
        beforeEach(function () {
          view = new Stack({
            interactive: false,
            wrapper: wrapper,
            collection: collection,
            scales: {
              x: function (x) {
                return x;
              },
              y: function (y) {
                return y;
              }
            },
            graph: graph,
            valueAttr: 'a:count',
            grouped: true
          });
          graph.getY0Pos = function (index, attr) {
            return collection.at(index).get(attr) / 2;
          };
        });

        it('selects stack if valueAttr option matches line valueAttr', function () {
          view.render();
          view.onChangeSelected(collection.at(3), 3, { valueAttr: 'a:count' });
          expect(wrapper.select('path.line').attr('class')).toContain('selected');
          expect(wrapper.select('path.stack').attr('class')).toContain('selected');
        });

        it('deselects stack if valueAttr option does not match line valueAttr', function () {
          view.render();
          view.onChangeSelected(collection.at(3), 3, { valueAttr: 'b:count' });
          expect(wrapper.select('path.line').attr('class').split(' ')).not.toContain('selected');
          expect(wrapper.select('path.line').attr('class').split(' ')).toContain('not-selected');
          expect(wrapper.select('path.stack').attr('class').split(' ')).not.toContain('selected');
          expect(wrapper.select('path.stack').attr('class').split(' ')).toContain('not-selected');
        });

        it('renders a highlighted cursor line across the the stack', function () {
          view.render();

          view.onChangeSelected(collection.at(0), 0, { valueAttr: 'a:count' });

          expect(wrapper.selectAll('.cursorLine.selected').attr('x1')).toEqual('0.5');
          expect(wrapper.selectAll('.cursorLine.selected').attr('x2')).toEqual('0.5');
          expect(wrapper.selectAll('.cursorLine.selected').attr('y1')).toEqual('0.5');
          expect(wrapper.selectAll('.cursorLine.selected').attr('y2')).toEqual('1');

          view.onChangeSelected(collection.at(1), 1, { valueAttr: 'a:count' });

          expect(wrapper.selectAll('.cursorLine.selected').attr('x1')).toEqual('1.5');
          expect(wrapper.selectAll('.cursorLine.selected').attr('x2')).toEqual('1.5');
          expect(wrapper.selectAll('.cursorLine.selected').attr('y1')).toEqual('2');
          expect(wrapper.selectAll('.cursorLine.selected').attr('y2')).toEqual('4');
        });

        it('renders an extra selection point at bottom of stack', function () {
          view.render();

          view.onChangeSelected(collection.at(3), 3, { valueAttr: 'a:count' });

          expect(wrapper.selectAll('.selectedIndicator')[0].length).toEqual(2);
          var c1 = d3.select(wrapper.selectAll('.selectedIndicator')[0][0]);
          var c2 = d3.select(wrapper.selectAll('.selectedIndicator')[0][1]);
          expect(c1.attr('cy')).toEqual('9');
          expect(c2.attr('cy')).toEqual('4.5');
        });

      });

    });
  });
});
