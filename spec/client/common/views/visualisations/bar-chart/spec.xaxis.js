define([
  'common/views/visualisations/bar-chart/xaxis',
  'extensions/collections/collection'
],
function (XAxis,Collection) {
  describe('Bar chart XAxisComponent',function () {

    var el,wrapper;
    beforeEach(function () {
      el = $('<div></div>').appendTo($('body'));
      wrapper = XAxis.prototype.d3.select(el[0]).append('svg').append('g');
    });

    afterEach(function () {
      el.remove();
    });

    function createView() {

      var collection = new Collection();
      var values = [
        {
          '_start_at': '2014-01-01T00:00:00+00:00',
          '_end_at': '2014-04-01T00:00:00+00:00',
          'title': 'step 1'
        },
        {
          '_start_at': '2014-04-01T00:00:00+00:00',
          '_end_at': '2014-07-01T00:00:00+00:00',
          'title': 'step 2'
        },
        {
          '_start_at': '2014-07-01T00:00:00+00:00',
          '_end_at': '2014-10-01T00:00:00+00:00',
          'title': 'step 3'
        }
      ];

      collection.reset([{
        values: new Collection(values)
      }, {}]);

      var view = new XAxis({
        collection: collection,
        wrapper: wrapper,
        getScale: function () {
          return d3.scale.linear();
        },
        graph: {
          innerWidth: 0,
          innerHeight: 0
        }
      });

      return view;
    }

    describe('ticks',function () {
      it('display formatted periods when axisPeriod is set',function () {
        var view = createView();
        view.axisPeriod = 'quarter';

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(view.tickValues()).toEqual([[0,1,2]]);
        expect(wrapper.selectAll('.tick')[0].length).toEqual(3);

        expect(d3.select(ticks[0]).text()).toEqual('Jan to Mar 2014');
        expect(d3.select(ticks[1]).text()).toEqual('Apr to June 2014');
        expect(d3.select(ticks[2]).text()).toEqual('July to Sep 2014');
      });

      it('display titles when axisPeriod is not set',function () {
        var view = createView();

        view.render();

        var ticks = wrapper.selectAll('.tick')[0];
        expect(view.tickValues()).toEqual([[0,1,2]]);
        expect(wrapper.selectAll('.tick')[0].length).toEqual(3);

        expect(d3.select(ticks[0]).text()).toEqual('step 1');
        expect(d3.select(ticks[1]).text()).toEqual('step 2');
        expect(d3.select(ticks[2]).text()).toEqual('step 3');
      });

    });


  });
});
