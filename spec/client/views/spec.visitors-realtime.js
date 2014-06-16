define([
  'client/views/visualisations/visitors-realtime',
  'common/collections/realtime',
  'extensions/models/model'
],
function (VisitorsRealtimeView, Collection) {
  describe('VisitorsRealtimeView', function () {

    var collection, view;
    beforeEach(function () {
      collection = new Collection([], { title: 'foo', id: 'bar' });
      var data = [
        {
          '_timestamp': collection.getMoment('2002-03-01T00:00:00+00:00'),
          'unique_visitors': 120
        },
        {
          '_timestamp': collection.getMoment('2002-03-01T00:03:00+00:00'),
          'unique_visitors': 100
        }
      ];
      collection.reset({ data: data }, { parse: true });

      view = new VisitorsRealtimeView({
        collection: collection
      });

      view.valueAttr = 'unique_visitors';

    });

    afterEach(function () {
      view.remove();
    });

    describe('initialize', function () {

      it('discards data that is more than 24 hours old', function () {

        var testView, testCollection;
        testCollection = new Collection([], { title: 'foo', id: 'bar' });
        var testData = [
          {
            '_timestamp': collection.getMoment('2002-03-02T01:06:00+00:00'),
            'unique_visitors': 1
          },
          {
            '_timestamp': collection.getMoment('2002-03-02T00:12:00+00:00'),
            'unique_visitors': 1
          },
          {
            '_timestamp': collection.getMoment('2002-03-01T01:07:00+00:00'),
            'unique_visitors': 1
          },
          {
            '_timestamp': collection.getMoment('2002-03-01T00:00:00+00:00'),
            'unique_visitors': 3
          }
        ];
        testCollection.reset({ data: testData }, { parse: true });
        testView = new VisitorsRealtimeView({
          collection: testCollection
        });
        jasmine.serverOnly(function () {
          testView.sparkline = false;
        });

        jasmine.renderView(testView, function () {
          expect(testCollection.first().get('values').length).toEqual(3);
          // The collection should not include the oldest timestamp
          expect(testCollection.first().get('values').some(function (model) {
            return model.get('_timestamp').format() === testData[3]._timestamp.format();
          })).toEqual(false);
        });
      });

      describe('collection events', function () {

        describe('onChangeSelected', function () {

          it('should not listen change:selected when changeOnSelected is false', function () {
            spyOn(VisitorsRealtimeView.prototype, 'onChangeSelected');
            spyOn(VisitorsRealtimeView.prototype, 'render');
            view = new VisitorsRealtimeView({
              collection: collection,
              changeOnSelected: false
            });
            collection.trigger('change:selected');

            expect(view.onChangeSelected).not.toHaveBeenCalled();
          });

          it('should listen change:selected by default', function () {
            spyOn(VisitorsRealtimeView.prototype, 'onChangeSelected');
            spyOn(VisitorsRealtimeView.prototype, 'render');

            view.initialize();

            collection.trigger('change:selected');
            expect(view.onChangeSelected).toHaveBeenCalled();
          });

        });

        describe('render', function () {

          it('should call onChangeSelected', function () {
            spyOn(VisitorsRealtimeView.prototype, 'onChangeSelected');
            view.initialize();
            VisitorsRealtimeView.prototype.onChangeSelected.reset();

            expect(view.onChangeSelected).not.toHaveBeenCalled();

            view.render();

            expect(view.onChangeSelected).toHaveBeenCalled();
          });

        });

      });

    });

    it('renders number of users at most recent timestamp', function () {
      jasmine.renderView(view, function () {
        expect(view.$el.find('.impact-number strong').text()).toEqual('100');
      });
    });

    it('renders correct labels', function () {
      jasmine.renderView(view, function () {
        expect(view.$el.find('.stat-description').text()).toEqual('users online at 12am 1 March 2002');
        expect(view.$el.find('.sparkline-title').text()).toEqual('users in the 3 minutes to 12am 1 March 2002');
      });
    });

    it('renders correct labels for data near now', function () {

      var testView, testCollection;
      testCollection = new Collection([], { title: 'foo', id: 'bar' });

      var testData = [
        {
          '_timestamp': testCollection.moment().subtract('minutes', 3),
          'unique_visitors': 3
        },
        {
          '_timestamp': testCollection.moment(),
          'unique_visitors': 5
        }
      ];
      testCollection.reset({ data: testData }, { parse: true });
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('.stat-description').text()).toEqual('users online now');
        expect(testView.$el.find('.sparkline-title').text()).toEqual('Users over past 3 minutes');
      });
    });

    it('renders singular labels if there is just one user', function () {

      var testView, testCollection;
      testCollection = new Collection([], { title: 'foo', id: 'bar' });
      var testData = [
        {
          '_timestamp': collection.getMoment('2002-03-01T00:00:00+00:00'),
          'unique_visitors': 3
        },
        {
          '_timestamp': collection.getMoment('2002-03-01T00:03:00+00:00'),
          'unique_visitors': 1
        }
      ];
      testCollection.reset({ data: testData }, { parse: true });
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      testView.valueAttr = 'unique_visitors';
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('.stat-description').text()).toEqual('user online at 12am 1 March 2002');
      });
    });

    it('does not render a sparkline if there is only one data item', function () {

      var testView, testCollection;
      testCollection = new Collection([], { title: 'foo', id: 'bar' });
      var testData = [
        {
          '_timestamp': collection.getMoment('2002-03-01T00:00:00+00:00'),
          'unique_visitors': 3
        }
      ];
      testCollection.reset({ data: testData }, { parse: true });
      testView = new VisitorsRealtimeView({
        collection: testCollection
      });
      jasmine.serverOnly(function () {
        testView.sparkline = false;
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('figure').length).toEqual(0);
      });

    });

    describe('getValue', function () {
      it('should return the right value', function () {
        var returnValue = view.getValue();
        expect(returnValue).toEqual(100);
      });
    });

    describe('getLabel', function () {
      it('should return the right value', function () {
        var returnValue = view.getLabel();
        expect(returnValue.headline).toEqual('users online at<br/> 12am 1 March 2002');
        expect(returnValue.graph).toEqual('users in the 3 minutes to<br/> 12am 1 March 2002');
      });
    });

    describe('getValueSelected', function () {
      it('should return the right value', function () {
        var fakeSelection = {
          selectedModel: {
            get: function (key) {
              return {
                'unique_visitors': 140
              }[key];
            }
          }
        };
        var returnValue = view.getValueSelected(fakeSelection);
        expect(returnValue).toEqual(140);
      });
    });

    describe('getLabelSelected', function () {
      it('should call the view formatPeriod method with the appropriate selectedModel attribute', function () {
        var fakeSelection = {
          selectedModel: {
            get: function (key) {
              return {
                '_timestamp': collection.getMoment('2002-03-01T00:06:00+00:00'),
                'unique_visitors': 140
              }[key];
            }
          }
        };
        var returnValue = view.getLabelSelected(fakeSelection);
        expect(returnValue.headline).toEqual('users 1 Mar 2002,<br />12 years ago');
        expect(returnValue.graph).toEqual('');
      });
    });

  });
});
