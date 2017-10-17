define([
  'client/views/graph/yaxis',
  'client/views/graph/graph',
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

      collection.reset({
        data: values
      }, { parse: true });

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

    describe('ticks', function () {

      it('returns the graph numYTicks by default', function () {
        var view = viewForValues(0, 10, true, 10);
        view.graph.numYTicks = 10;
        expect(view.ticks()).toEqual(10);

        view.graph.numYTicks = 5;
        expect(view.ticks()).toEqual(5);
      });

      it('returns zero if the graph has no data', function () {
        var view = viewForValues(0, 10, true, 10);
        spyOn(view.graph, 'hasData').and.returnValue(false);
        expect(view.ticks()).toEqual(0);
      });

    });

    describe('tickFormat()', function () {
      it('uses the numberListFormatter if theres a tick value list from the graph', function () {
        var view = viewForValues(0, 10, true, 10);
        spyOn(view, 'numberListFormatter');
        view.scales.y.tickValueList = [];

        view.tickFormat();

        expect(view.numberListFormatter).toHaveBeenCalled();
      });

      it('uses the standard formatter with formatOptions when its a duration', function () {
        var view = viewForValues(0, 10, true, 10);
        spyOn(view, 'format');
        view.scales.y.tickValueList = undefined;
        view.graph.formatOptions = {
          type: 'duration'
        };

        var formatter = view.tickFormat();

        formatter(1000);

        expect(view.format).toHaveBeenCalledWith(1000, view.graph.formatOptions);
      });

      it('uses the standard formatter with formatOptions when its a percentage', function () {
        var view = viewForValues(0, 10, true, 10);
        spyOn(view, 'format');
        view.scales.y.tickValueList = undefined;
        view.graph.formatOptions = 'percent';

        var formatter = view.tickFormat();

        expect(typeof formatter).toEqual('function');

        formatter(0.1);

        expect(view.format).toHaveBeenCalledWith(0.1, view.graph.formatOptions);
      });
    });


  });
});
