define([
  'common/views/visualisations/journey-graph/callout',
  'common/collections/journey_series'
],
function (JourneyCallout, JourneySeriesCollection) {
  describe('JourneyCallout', function () {

    describe('rendering', function () {
      var d3 = JourneyCallout.prototype.d3;

      var el, wrapper, collection, view;
      beforeEach(function () {

        el = $('<div></div>').appendTo($('body'));
        wrapper = d3.select(el[0]).append('svg').append('g');

        var Collection = JourneySeriesCollection.extend({
          getMoment: function() {
            return JourneySeriesCollection.prototype.getMoment('2013-06-03T00:00:00+00:00');
          }

        });

        collection = new Collection([], {
          matchingAttribute: 'title',
          valueAttr: 'uniqueEvents',
          axes: {
            y: [
              { groupId: 'Stage 1' },
              { groupId: 'Stage 2' },
              { groupId: 'Stage 3' }
            ]
          }
        });
        collection.reset({
          data: [
            { title: 'Stage 1', uniqueEvents: 20 },
            { title: 'Stage 2', uniqueEvents: 15 },
            { title: 'Stage 3', uniqueEvents: 10 }
          ]
        }, { parse: true });

        view = new JourneyCallout({
          wrapper: wrapper,
          collection: collection,
          blockMarginFraction: 0.2,
          barMarginFraction: 0.2,
          graph: {
            scaleFactor: jasmine.createSpy().andReturn(1),
            valueAttr: 'uniqueEvents'
          },
          margin: {
            top: 10,
            right: 20,
            bottom: 30,
            left: 40
          },
          scales: {
            x: function (v) {
              return v * 20;
            }
          }
        });
        view.render();
      });

      afterEach(function () {
        el.remove();
      });

      it('creates a callout with information about the currently selected item', function () {
        view.onChangeSelected(collection.at(0), 0);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack">27 May to 2 June 2013</span> Stage: Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>20</dd>' +
                                               '<dt>Percentage relative to start:</dt><dd>100%</dd>');

        view.onChangeSelected(collection.at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack">27 May to 2 June 2013</span> Stage: Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>15</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>75%</dd>');

        view.onChangeSelected(collection.at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack">27 May to 2 June 2013</span> Stage: Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>10</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>50%</dd>');
      });

      it('positions an arrow element to point to the currently selected model', function () {
        view.onChangeSelected(collection.at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('48px');

        view.onChangeSelected(collection.at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('68px');

        view.onChangeSelected(collection.at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('88px');
      });
    });

  });
});
