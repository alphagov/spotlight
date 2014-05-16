define([
  'common/views/visualisations/multi_stats',
  'common/views/visualisations/multi_stat_item',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (MultiStatsView, MultiStatItem, Model, Collection) {
  describe('MultiStatsView', function () {

    var collection, view;
    beforeEach(function () {
      spyOn(MultiStatItem.prototype, 'initialize').andCallThrough();
      spyOn(MultiStatItem.prototype, 'render').andCallThrough();
      collection = new Collection();
      collection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection([
          {
            _start_at: collection.getMoment('2013-08-01T00:00:00+00:00'),
            a: 1,
            b: 2,
            c: 0,
            d: 0,
            e: 5
          },
          {
            _start_at: collection.getMoment('2013-09-01T00:00:00+00:00'),
            a: 0.5,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ])
      } ]);
      view = new MultiStatsView({
        collection: collection,
        model: new Model({
          'stats': [
            {
              'title': 'Statistic A',
              'attr': 'a'
            },
            {
              'title': 'Statistic B',
              'attr': 'b',
              'format': '£{{ value }}'
            },
            {
              'title': 'Statistic C',
              'attr': 'c',
              'format': '{{ value }}%'
            },
            {
              'title': 'Statistic D',
              'attr': 'd',
              'format': '{{ value }}%'
            },
            {
              'title': 'Statistic E',
              'attr': 'e',
              'format': '{{ value }}%'
            },
          ]
        })
      });
      jasmine.serverOnly(function () {
        view.sparkline = false;
      });
    }),

    it('adds li elements to the page', function () {
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li').length).toEqual(5);
      });

    });

    it('creates and renders a view for each stat', function () {
      jasmine.renderView(view, function () {
        expect(MultiStatItem.prototype.initialize.calls.length).toEqual(5);
        expect(MultiStatItem.prototype.render.calls.length).toEqual(5);
      });
    });

    it('passes model to item views', function () {
      jasmine.renderView(view, function () {
        _.each(MultiStatItem.prototype.initialize.calls, function (call) {
          expect(call.args[0].model).toEqual(view.model);
        });
      });
    });

    it('has some of the expected content', function () {
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li:eq(0) h3')).toHaveText('Statistic A');
      });
    });

  });
});
