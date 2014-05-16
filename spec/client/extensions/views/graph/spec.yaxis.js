define([
  'extensions/views/graph/yaxis',
  'extensions/views/graph/graph',
  'extensions/collections/collection'
],
function (YAxis, Graph, Collection) {
  describe('YAxisComponent', function () {

    var el, wrapper;
    beforeEach(function () {
      el = $('<div></div>').appendTo($('body'));
      wrapper = YAxis.prototype.d3.select(el[0]).append('svg').append('g');
    });

    afterEach(function () {
      el.remove();
    });

    function viewForValues(start, end, showStartAndEndTicks, numTicks) {

      var collection = new Collection();
      var values = [];

      for (var i = start; i <= end; i += 1) {
        values.push({ 'value': i });
      }

      collection.reset([{
        values: new Collection(values)
      }]);

      var graph = new Graph({
        el: el,
        collection: collection,
        valueAttr: 'value',
        numYTicks: numTicks || 7
      });
      graph.innerWidth = 500;
      graph.innerHeight = 500;

      var view = new YAxis({
        collection: collection,
        wrapper: wrapper,
        showStartAndEndTicks: showStartAndEndTicks,
        scales: {
          y: graph.calcYScale()
        },
        graph: graph
      });

      return view;
    }

    describe('when showStartAndEndTicks is not set', function () {
      it('shows the expected number of ticks', function () {
        var view = viewForValues(0, 100, false, null);

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(6);
        expect(d3.select(ticks[0]).text()).toEqual('0');
        expect(d3.select(ticks[1]).text()).toEqual('20');
        expect(d3.select(ticks[2]).text()).toEqual('40');
        expect(d3.select(ticks[3]).text()).toEqual('60');
        expect(d3.select(ticks[4]).text()).toEqual('80');
        expect(d3.select(ticks[5]).text()).toEqual('100');
      });
    });

    describe('when showStartAndEndTicks is set', function () {
      it('shows only the start and end ticks', function () {
        var view = viewForValues(0, 100, true, 1);

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(2);
        expect(d3.select(ticks[0]).text()).toEqual('0');
        expect(d3.select(ticks[1]).text()).toEqual('100');
      });
    });

    describe('when showStartAndEndTicks is set and the max value in the data is not a round number', function () {
      it('shows an end tick for the nearest round number', function () {
        var view = viewForValues(0, 143, true, 1);

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(2);
        expect(d3.select(ticks[0]).text()).toEqual('0');
        expect(d3.select(ticks[1]).text()).toEqual('200');
      });
    });


  });
});
