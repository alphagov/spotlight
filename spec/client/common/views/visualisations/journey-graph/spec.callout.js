define([
  'common/views/visualisations/journey-graph/callout',
  'extensions/collections/collection',
  'extensions/models/model'
],
function (JourneyCallout, Collection, Model) {
  describe("JourneyCallout", function () {

    describe("rendering", function () {
      var d3 = JourneyCallout.prototype.d3;

      var el, wrapper, collection, view;
      beforeEach(function () {
        el = $('<div></div>').appendTo($('body'));
        wrapper = d3.select(el[0]).append('svg').append('g');
        collection = new Collection([
          {
            values: new Collection([
              { title: 'Stage 1', uniqueEvents:20 },
              { title: 'Stage 2', uniqueEvents:15 },
              { title: 'Stage 3', uniqueEvents:10 }
            ])
          },
          {
            values: new Collection([
              { title: 'Stage 1', uniqueEvents:25 },
              { title: 'Stage 2', uniqueEvents:20 },
              { title: 'Stage 3', uniqueEvents:15 }
            ])
          }
        ]);
        collection.at(0).get('values').query = new Model({
          start_at: collection.getMoment('2013-05-27T00:00:00+00:00'),
          end_at: collection.getMoment('2013-06-03T00:00:00+00:00')
        });
        collection.at(1).get('values').query = new Model({
          start_at: collection.getMoment('2013-06-03T00:00:00+00:00'),
          end_at: collection.getMoment('2013-06-10T00:00:00+00:00')
        });
        view = new JourneyCallout({
          wrapper:wrapper,
          collection:collection,
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
          scales:{
            x: function (v) {
              return v * 20;
            }
          }
        });
      });

      afterEach(function () {
        el.remove();
      });

      it("creates a callout with information about the currently selected item", function () {
        view.render();

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May to 2 June 2013</span> Stage: Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>20</dd>' +
                                               '<dt>Percentage relative to start:</dt><dd>100%</dd>');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May to 2 June 2013</span> Stage: Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>15</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>75%</dd>');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May to 2 June 2013</span> Stage: Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>10</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>50%</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(0), 0);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 to 9 June 2013</span> Stage: Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>25</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>100%</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 to 9 June 2013</span> Stage: Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>20</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>80%</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 to 9 June 2013</span> Stage: Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Number of users:</dt><dd>15</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>60%</dd>');
      });

      it("positions an arrow element to point to the currently selected model", function () {
        view.render();

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('45px');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('65px');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('85px');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('55px');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('75px');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('95px');
      });

      it("positions an arrow element to point to the currently selected model when there is only one series", function () {
        collection.pop();

        view.render();

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(0), 0);
        expect(view.$el.find('.arrow').css('left')).toEqual('50px');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('.arrow').css('left')).toEqual('70px');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('.arrow').css('left')).toEqual('90px');
      });
    });

  });
});
