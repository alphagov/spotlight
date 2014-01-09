define([
  'common/views/visualisations/visitors-realtime',
  'extensions/collections/collection'
],
function (VisitorsRealtimeView, Collection) {
  describe("VisitorsRealtimeView", function () {
    it("renders a number", function () {
      var view = new VisitorsRealtimeView({
        collection: new Collection([{
          "unique_visitors": 10
        }])
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual(
          '<p>  <span class="impact-number"><strong>10</strong></span>  <span class="stat-description">users online now</span></p>'
        );
      });
    });

    it("renders singular if one user", function () {
      var view = new VisitorsRealtimeView({
        collection: new Collection([{
          "unique_visitors": 1
        }])
      });

      jasmine.renderView(view, function () {
        expect(view.$el.find('.stat-description').text()).toEqual('user online now');
      });
    });

    describe('interpolating numbers', function () {
      beforeEach(function() {
        jasmine.Clock.useMock();
      });

      it("interpolates from previous to latest entry", function () {
        jasmine.clientOnly(function () {
          var collection = new Collection([
            { "unique_visitors": 10 }
          ]);
          collection.updateInterval = 12000;
          var view = new VisitorsRealtimeView({
            collection: collection
          });
          jasmine.renderView(view, function () {
            collection.set([{ "unique_visitors": 34 }]);
            collection.trigger('sync');
            expect(view.$el.find('strong')).toHaveHtml('11');
            jasmine.Clock.tick(view.updateInterval);
            // first tick
            expect(view.$el.find('strong')).toHaveHtml('12');
            jasmine.Clock.tick(view.updateInterval);
            // second tick
            expect(view.$el.find('strong')).toHaveHtml('13');
            jasmine.Clock.tick(view.updateInterval * 21);
            // reached the new value
            expect(view.$el.find('strong')).toHaveHtml('34');
            jasmine.Clock.tick(view.updateInterval * 10);
            // nothing happens, new value was already reached
            expect(view.$el.find('strong')).toHaveHtml('34');
          });
        });
      });
    });

    it("renders nothing when there's no data", function () {
      var view = new VisitorsRealtimeView({
        collection: new Collection([])
      });

      jasmine.renderView(view, function () {
        expect(view.$el.html()).toEqual('');
      });
    });
  });
});
