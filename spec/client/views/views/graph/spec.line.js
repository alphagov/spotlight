define([
  'client/views/graph/line',
  'extensions/collections/collection'
],
function (Line, Collection) {
  describe('Line component', function () {
    var el, wrapper, collection, graph;
    var d3 = Line.prototype.d3;
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
        view = new Line({
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

      it('renders a line', function () {
        view.render();
        var coords = _.map(collection.pluck('a:count'), function (y, i) {
          return (i + 0.5) + ',' + (y);
        });
        var line = 'M' + coords.join('L');
        expect(wrapper.selectAll('path.line').attr('d')).toEqual(line);
      });

      it('renders multiple paths when there are gaps in the data', function () {
        collection.at(2).set('a:count', null);
        view.render();
        expect(wrapper.selectAll('path.line').attr('d')).toEqual('M0.5,1L1.5,4M3.5,9L4.5,11');
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
      });

      describe('renderTerminators', function () {

        it('adds line terminators to the end of a dataset', function () {
          view.render();
          expect(wrapper.selectAll('circle.terminator').attr('cx')).toEqual('4.5');
          expect(wrapper.selectAll('circle.terminator').attr('cy')).toEqual('11');
        });

        it('adds line terminators around gaps in the dataset', function () {
          collection.at(2).set('a:count', null);
          view.render();
          var terminators = wrapper.selectAll('circle.terminator');

          expect(d3.select(terminators[0][0]).attr('cx')).toEqual('1.5');
          expect(d3.select(terminators[0][0]).attr('cy')).toEqual('4');

          expect(d3.select(terminators[0][1]).attr('cx')).toEqual('3.5');
          expect(d3.select(terminators[0][1]).attr('cy')).toEqual('9');
        });

        it('does not add a terminator to the start of a complete dataset', function () {
          view.render();
          expect(wrapper.selectAll('circle.terminator')[0].length).toEqual(1);
          expect(wrapper.selectAll('circle.terminator').attr('cx')).toEqual('4.5');
        });

        it('adds a terminator to the start of a dataset missing data at start', function () {
          collection.at(0).set('a:count', null);
          view.render();
          expect(wrapper.selectAll('circle.terminator')[0].length).toEqual(2);
          expect(d3.select(wrapper.selectAll('circle.terminator')[0][0]).attr('cx')).toEqual('1.5');
          expect(d3.select(wrapper.selectAll('circle.terminator')[0][0]).attr('cy')).toEqual('4');
        });

      });

    });

    describe('onChangeSelected', function () {

      var view;
      beforeEach(function () {
        view = new Line({
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
      });

      it('renders a cursor line', function () {
        view.render();
        view.onChangeSelected(collection.at(0), 0);
        expect(wrapper.selectAll('line.cursorLine')[0].length).toEqual(1);

        var line = d3.select(wrapper.selectAll('line.cursorLine')[0][0]);
        expect(line.attr('x1')).toEqual('0.5');
        expect(line.attr('x2')).toEqual('0.5');
        expect(line.attr('y1')).toEqual('0');
        expect(line.attr('y2')).toEqual('100');
      });

      it('renders a selection point', function () {
        view.render();
        view.onChangeSelected(collection.at(3), 3);
        expect(wrapper.selectAll('.selectedIndicator')[0].length).toEqual(1);
        var c1 = d3.select(wrapper.selectAll('.selectedIndicator')[0][0]);
        expect(c1.attr('cx')).toEqual('3.5');
        expect(c1.attr('cy')).toEqual('9');
      });

      it('removes classes, selection point and cursor line if no model is selected', function () {
        view.render();
        view.onChangeSelected(collection.at(0), 0);
        expect(wrapper.select('path.line').attr('class').split(' ')).toContain('selected');
        expect(wrapper.selectAll('line.cursorLine')[0].length).toEqual(1);
        expect(wrapper.selectAll('.selectedIndicator')[0].length).toEqual(1);

        view.onChangeSelected(null, null);
        expect(wrapper.select('path.line').attr('class').split(' ')).not.toContain('selected');
        expect(wrapper.select('path.line').attr('class').split(' ')).not.toContain('not-selected');
        expect(wrapper.selectAll('line.cursorLine')[0].length).toEqual(0);
        expect(wrapper.selectAll('.selectedIndicator')[0].length).toEqual(0);
      });

      describe('when part of a group', function () {

        it('selects line if valueAttr option matches line valueAttr', function () {
          view.render();
          view.onChangeSelected(collection.at(3), 3, { valueAttr: 'a:count' });
          expect(wrapper.select('path.line').attr('class')).toContain('selected');
        });

        it('deselects line if valueAttr option does not match line valueAttr', function () {
          view.render();
          view.onChangeSelected(collection.at(3), 3, { valueAttr: 'b:count' });
          expect(wrapper.select('path.line').attr('class').split(' ')).not.toContain('selected');
          expect(wrapper.select('path.line').attr('class').split(' ')).toContain('not-selected');
        });

      });

    });
  });
});
