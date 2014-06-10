define([
  'common/views/visualisations/user-satisfaction-graph',
  'common/views/visualisations/completion_rate',
  'common/collections/user-satisfaction',
  'extensions/models/model'
],
function (UserSatisfactionGraphView, CompletionRateView, Collection, Model) {
  describe('User satisfaction graph', function () {

    var collection, view;

    beforeEach(function () {
      spyOn(CompletionRateView.prototype, 'views').andReturn({});
      collection = new Collection();
      var data = [
        {
          'total:sum': 229.0,
          _timestamp: collection.getMoment('2004-04-01T00:00:00+00:00'),
          'rating_1:sum': 3.0,
          'rating_2:sum': 1.0,
          'rating_3:sum': 16.0,
          'rating_4:sum': 62.0,
          'rating_5:sum': 147.0,
          'rating': 0.88100436681223
        },
        {
          'total:sum': 248.0,
          _timestamp: collection.getMoment('2004-05-01T00:00:00+00:00'),
          'rating_1:sum': 0.0,
          'rating_2:sum': 1.0,
          'rating_3:sum': 0.0,
          'rating_4:sum': 100.0,
          'rating_5:sum': 147.0,
          'rating': 0.88100436681223
        },
        {
          'total:sum': 230.0,
          _timestamp: collection.getMoment('2004-06-01T00:00:00+00:00'),
          'rating_1:sum': 3.0,
          'rating_2:sum': 2.0,
          'rating_3:sum': 16.0,
          'rating_4:sum': 62.0,
          'rating_5:sum': 147.0,
          'rating': 0.88100436681223
        }
      ];
      collection.reset([ {
        id: 'test',
        title: 'test',
        'periods': {
          'total': 30,
          'available': 30
        },
        'totalRatings': 0.89076170869789,
        values: new Collection(data)
      } ]);

      view = new UserSatisfactionGraphView({
        collection: collection,
        valueAttr: 'rating',
        totalAttr: 'totalRatings',
        sortBy: '_timestamp:ascending',
        limit: 0,
        min: 1,
        max: 5,
        model: new Model({
          'page-type': 'module'
        }),
        period: 'day',
        duration: 30,
        trim: true,
        axes: {
          x: {
            label: 'Date',
            key: '_start_at',
            format: 'date'
          },
          y: [
            {
              label: 'Rating',
              key: 'rating',
              format: 'percent'
            }
          ]
        }
      });

    });

    afterEach(function () {
      view.remove();
    });

    describe('rendering a graph', function () {
      it('renders the bars x-axis', function () {
        jasmine.renderView(view, function () {
          var xaxis = view.$el.find('.x-axis text');

          expect($(xaxis[0]).text()).toEqual('Very dissatisfied');
          expect($(xaxis[1]).text()).toEqual('Dissatisfied');
          expect($(xaxis[2]).text()).toEqual('Neither satisfied or dissatisfied');
          expect($(xaxis[3]).text()).toEqual('Satisfied');
          expect($(xaxis[4]).text()).toEqual('Very satisfied');
        });
      });

      it('renders the correct bar values', function () {
        jasmine.renderView(view, function () {
          var bar = view.$el.find('.bar text');

          expect($(bar[0]).text()).toEqual('6');
          expect($(bar[1]).text()).toEqual('4');
          expect($(bar[2]).text()).toEqual('32');
          expect($(bar[3]).text()).toEqual('224');
          expect($(bar[4]).text()).toEqual('441');
        });
      });

      it('doesn\'t render the bars on the dashboard, only on page-per-thing', function () {
        view.model.set('page-type', undefined);

        jasmine.renderView(view, function () {
          expect(view.$el.find('.bar').length).toEqual(0);
        });
      });

      describe('updating the graph', function () {
        it('updates the bar values when the collection is reset', function () {
          jasmine.renderView(view, function () {
            var changedModel = collection.at(0).get('values').at(2);
            view.collection.trigger('change:selected', undefined, undefined, changedModel);
            var bar = view.$el.find('.bar text');

            expect($(bar[0]).text()).toEqual('3');
            expect($(bar[1]).text()).toEqual('2');
            expect($(bar[2]).text()).toEqual('16');
            expect($(bar[3]).text()).toEqual('62');
            expect($(bar[4]).text()).toEqual('147');
          });
        });
      });

    });

  });

});
