define([
  'client/views/graph/stacked-linelabel',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (LineLabel, Collection, Model) {

  describe('Stacked Line Label Component', function () {

    var el, wrapper, lineLabel, collection, graph;
    beforeEach(function () {

      collection = new Collection([
        { 'def:_count': 1, 'abc:_count': 10, 'def:_count:percent': 0.4, 'abc:_count:percent': 0.6, 'total:_count': 11 },
        { 'def:_count': 2, 'abc:_count': 100, 'def:_count:percent': 0.4, 'abc:_count:percent': 0.6, 'total:_count': 102 },
        { 'def:_count': 3, 'abc:_count': 1000, 'def:_count:percent': 0.4, 'abc:_count:percent': 0.6, 'total:_count': 1003 },
        { 'def:_count': null, 'abc:_count': 10000, 'def:_count:percent': 0.4, 'abc:_count:percent': 0.6, 'total:_count': 10000 }
      ]);
      spyOn(collection, 'getPeriod').and.returnValue('week');

      graph = {
        innerWidth: 400,
        valueAttr: '_count',
        getLines: function () {
          return [
            { label: 'Title 1', key: 'abc:_count' },
            { label: 'Title 2', key: 'def:_count' }
          ];
        },
        isOneHundredPercent: function () {
          return false;
        },
        hasTotalLine: function () {
          return false;
        },
        hasTotalLabel: function () {
          return true;
        },
        getYPos: function (i, attr) { return collection.at(i).get(attr) ? 2 * collection.at(i).get(attr) : null; },
        getY0Pos: function (i, attr) { return collection.at(i).get(attr); },
        modelToDate: function () {
          return Date.now();
        },
        on: function () {}
      };

      el = $('<div></div>').appendTo($('body'));
      wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');

      lineLabel = new LineLabel({
        collection: collection,
        graph: graph,
        model: new Model({ period: 'week' })
      });
      lineLabel.wrapper = wrapper;
      lineLabel.offset = 100;
      lineLabel.linePaddingInner = 20;
      lineLabel.linePaddingOuter = 30;
      lineLabel.margin = {
        top: 100,
        right: 200,
        bottom: 300,
        left: 400
      };
      lineLabel.scales = {
        y: function (i) { return i; }
      };
    });

    afterEach(function () {
      el.remove();
    });

    /*
    NOTE: the initial svg returned by the "d3.select" in graph.js
    gives different results in the browser vs phantom

    These following tests don't calculate correctly in a browser, because
    the inital width of the svg node seems to be fixed at 600px
    */
    if (window.callPhantom) {

      describe('getYIdeal', function () {

        beforeEach(function () {
          spyOn(lineLabel.graph, 'getYPos').and.callThrough();
          spyOn(lineLabel.graph, 'getY0Pos').and.callThrough();
        });

        it('attempts to centre label in stack', function () {
          var result = lineLabel.getYIdeal('abc:_count');
          expect(result).toEqual(15000);
        });

        it('uses last non-null value', function () {
          var result = lineLabel.getYIdeal('def:_count');
          expect(result).toEqual(4.5);
        });

      });

      describe('render', function () {

        it('always renders percentages for non-null values', function () {
          lineLabel.render();
          var labels = lineLabel.$el.find('figcaption ol li');
          expect(labels.eq(0).find('.percentage').text()).toContain('(60%)');
        });

        it('always renders no-data for null values', function () {
          lineLabel.render();
          var labels = lineLabel.$el.find('figcaption ol li');
          expect(labels.eq(1).text()).toContain('(no data)');
        });

      });

    }

  });

});
