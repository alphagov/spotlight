define([
  'extensions/views/graph/stacked-linelabel',
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
        getYPos: function (i, attr) { return collection.at(i).get(attr) ? 2 * collection.at(i).get(attr) : null; },
        getY0Pos: function (i, attr) { return collection.at(i).get(attr); },
        modelToDate: function() {
          return Date.now();
        }
      };

      el = $('<div></div>').appendTo($('body'));
      wrapper = LineLabel.prototype.d3.select(el[0]).append('svg').append('g');

      lineLabel = new LineLabel({
        collection: collection,
        model: new Model({ period: 'week' })
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
      lineLabel.scales = {
        y: function (i) { return i; }
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
        var result = lineLabel.getYIdeal('abc:_count');
        expect(result).toEqual(15000);
      });

      it('uses last non-null value', function () {
        var result = lineLabel.getYIdeal('def:_count');
        expect(result).toEqual(4.5);
      });

    });

    describe('render', function () {

      beforeEach(function () {
        spyOn(lineLabel, 'renderSummary');
      });

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

  });

});
