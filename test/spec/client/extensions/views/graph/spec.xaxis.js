define([
  'extensions/views/graph/xaxis',
  'extensions/collections/collection',
  'moment'
],
function (XAxis, Collection, moment) {
  describe("XAxisComponent", function () {

    var el, wrapper;
    beforeEach(function() {
      el = $('<div></div>').appendTo($('body'));
      wrapper = XAxis.prototype.d3.select(el[0]).append('svg').append('g');
    });
    
    afterEach(function() {
      el.remove();
    });

    function viewForConfig(config, startDate, endDate) {
      var start = moment.utc(startDate);
      var end = moment.utc(endDate);
      var values = [];
      for (var date = start.clone(); +date < +end; date.add(1, config + 's')) {
        values.push({
          _end_at: date.clone()
        });
      }

      var collection = new Collection([{
        values: new Collection(values)
      }]);

      var view = new XAxis({
        collection: collection,
        wrapper: wrapper,
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

    describe("'hour' configuration", function () {
      it("shows 4 ticks for 6am, midday, 6pm and midnight", function () {
        var view = viewForConfig('hour', '2013-03-13T00:00:00', '2013-03-14T00:00:00');

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(4);
        expect(d3.select(ticks[0]).text()).toEqual('midnight');
        expect(d3.select(ticks[1]).text()).toEqual('6am');
        expect(d3.select(ticks[2]).text()).toEqual('midday');
        expect(d3.select(ticks[3]).text()).toEqual('6pm');
      });
    });

    describe("'day' configuration", function () {
      it("shows one tick per day, and labels only for Mondays", function () {
        var view = viewForConfig('day', '2013-03-05T00:00:00', '2013-04-05T00:00:00');

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(wrapper.selectAll('.tick')[0].length).toEqual(31);
        expect(d3.select(ticks[0]).text()).toEqual('4 Mar');
        expect(d3.select(ticks[1]).text()).toEqual('');
        expect(d3.select(ticks[7]).text()).toEqual('11 Mar');
        expect(d3.select(ticks[14]).text()).toEqual('18 Mar');
        expect(d3.select(ticks[21]).text()).toEqual('25 Mar');
        expect(d3.select(ticks[28]).text()).toEqual('1 Apr');
      });
    });

  });
});
