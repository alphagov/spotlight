define([
  'common/views/visualisations/conversion-graph/callout',
  'extensions/collections/collection',
  'extensions/models/model',
  'moment'
],
function (ConversionCallout, Collection, Model, moment) {
  describe("ConversionCallout", function () {

    describe("rendering", function () {
      var d3 = ConversionCallout.prototype.d3;

      var el, wrapper, collection, view;
      beforeEach(function () {
        el = $('<div></div>').appendTo($('body'));
        wrapper = d3.select(el[0]).append('svg').append('g');
        collection = new Collection([
          {
            values: new Collection([
              { title: 'Stage 1', uniqueEvents:12, uniqueEventsNormalised:0.34},
              { title: 'Stage 2', uniqueEvents:15 , uniqueEventsNormalised:0.42},
              { title: 'Stage 3', uniqueEvents:18, uniqueEventsNormalised:0.51}
            ])
          },
          {
            values: new Collection([
              { title: 'Stage 1', uniqueEvents:21, uniqueEventsNormalised:0.29 },
              { title: 'Stage 2', uniqueEvents:24, uniqueEventsNormalised:0.33 },
              { title: 'Stage 3', uniqueEvents:27, uniqueEventsNormalised:0.37 }
            ])
          }
        ]);
        collection.at(0).get('values').query = new Model({
          start_at: moment('2013-05-27'),
          end_at: moment('2013-06-03')
        });
        collection.at(1).get('values').query = new Model({
          start_at: moment('2013-06-03'),
          end_at: moment('2013-06-10')
        });
        view = new ConversionCallout({
          wrapper:wrapper,
          collection:collection,
          blockMarginFraction: 0.2,
          barMarginFraction: 0.2,
          graph: {
            scaleFactor: jasmine.createSpy().andReturn(1)
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
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May to 2 Jun 2013</span> Stage: Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>12</dd>' +
                                               '<dt>Percentage relative to start:</dt><dd>34%</dd>');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May to 2 Jun 2013</span> Stage: Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>15</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>42%</dd>');

        view.onChangeSelected(collection.at(0), 0, collection.at(0).get('values').at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack0">27 May to 2 Jun 2013</span> Stage: Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>18</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>51%</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(0), 0);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 to 9 Jun 2013</span> Stage: Stage 1');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>21</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>29%</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(1), 1);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 to 9 Jun 2013</span> Stage: Stage 2');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>24</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>33%</dd>');

        view.onChangeSelected(collection.at(1), 1, collection.at(1).get('values').at(2), 2);
        expect(view.$el.find('h3')).toHaveHtml('<span class="date stack1">3 to 9 Jun 2013</span> Stage: Stage 3');
        expect(view.$el.find('dl')).toHaveHtml('<dt>Unique visitors to stage:</dt><dd>27</dd>' +
                                                '<dt>Percentage relative to start:</dt><dd>37%</dd>');
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
    });

  });
});
