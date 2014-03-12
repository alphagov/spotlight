define([
  'extensions/views/graph/xaxis',
  'extensions/collections/collection'
],
function (XAxis, Collection) {
  describe('XAxisComponent', function () {

    var el, wrapper;
    beforeEach(function () {
      el = $('<div></div>').appendTo($('body'));
      wrapper = XAxis.prototype.d3.select(el[0]).append('svg').append('g');
    });

    afterEach(function () {
      el.remove();
    });

    function viewForConfig(config, startDate, endDate, useEllipses) {

      var collection = new Collection();
      var start = collection.getMoment(startDate);
      var end = collection.getMoment(endDate);
      var values = [];

      for (var date = start.clone(); +date < +end; date.add(1, config + 's')) {
        values.push({
          _end_at: date.clone()
        });
      }

      collection.reset([{
        values: new Collection(values)
      }]);

      var view = new XAxis({
        collection: collection,
        wrapper: wrapper,
        useEllipses: useEllipses,
        getScale: function () {
          return view.d3.time.scale().domain([start.toDate(), end.toDate()]);
        },
        graph: {
          innerWidth: 0,
          innerHeight: 0
        }
      });
      view.applyConfig(config);

      return view;
    }

    describe('"hour" configuration', function () {
      it('shows 5 ticks for midnight, 6am, midday, 6pm and midnight', function () {
        var view = viewForConfig('hour', '2013-03-13T00:00:00+00:00', '2013-03-14T00:00:00+00:00');

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(5);
        expect(d3.select(ticks[0]).text()).toEqual('midnight');
        expect(d3.select(ticks[1]).text()).toEqual('6am');
        expect(d3.select(ticks[2]).text()).toEqual('midday');
        expect(d3.select(ticks[3]).text()).toEqual('6pm');
        expect(d3.select(ticks[4]).text()).toEqual('midnight');
      });
    });

    describe('"day" configuration', function () {
      it('shows tick and label each Monday', function () {
        var view = viewForConfig('day', '2013-03-05T00:00:00+00:00', '2013-04-05T00:00:00+01:00');
        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(4);
        expect(d3.select(ticks[0]).text()).toEqual('11 Mar');
        expect(d3.select(ticks[1]).text()).toEqual('18 Mar');
        expect(d3.select(ticks[2]).text()).toEqual('25 Mar');
        expect(d3.select(ticks[3]).text()).toEqual('1 Apr');
      });
    });

    describe('"week" configuration', function () {
      it('shows tick and label each Monday', function () {
        var view = viewForConfig('week', '2013-03-05T00:00:00+00:00', '2013-04-05T00:00:00+01:00');
        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(4);
        expect(d3.select(ticks[0]).text()).toEqual('11 Mar');
        expect(d3.select(ticks[1]).text()).toEqual('18 Mar');
        expect(d3.select(ticks[2]).text()).toEqual('25 Mar');
        expect(d3.select(ticks[3]).text()).toEqual('1 Apr');
      });
    });

    describe('"month" configuration', function () {
      it('shows tick and label each month', function () {
        var view = viewForConfig('month', '2012-01-05T00:00:00+00:00', '2013-12-05T00:00:00+01:00');
        view.render();

        var ticks = wrapper.selectAll('.tick')[0];

        expect(wrapper.selectAll('.tick')[0].length).toEqual(23);
        expect(d3.select(ticks[0]).text()).toEqual('Feb');
        expect(d3.select(ticks[1]).text()).toEqual('Mar');
        expect(d3.select(ticks[2]).text()).toEqual('Apr');
        expect(d3.select(ticks[11]).text()).toEqual('Jan 2013');
      });
    });


    describe('any configuration', function () {
      it('renders ellipses for smaller screens', function () {
        var view = viewForConfig('hour', '2013-03-13T00:00:00+00:00', '2013-03-14T00:00:00+00:00', true);

        XAxis.prototype.d3.select(el[0]).select('svg').style('width', '400px');
        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(5);
        expect(d3.select(ticks[0]).text()).toContain('…');
      });
    });

  });
});
