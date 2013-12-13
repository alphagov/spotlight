define([
  'common/views/visualisations/multi_stat_item',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (MultiStatItemView, Model, Collection) {
  describe("MultiStatItemView", function () {
    
    // TODO: Should we test that the subviews are rendered? How?
    
    var collection, view;
    beforeEach(function() { 
      collection = new Collection();
      collection.reset([ {
        id: 'test',
        title: 'test',
        values: new Collection([
          {
            _start_at: collection.getMoment("2013-08-01T00:00:00+00:00"),
            a: 1, 
            b: 2,
            c: null,
            d: 0,
            e: 5
          },
          { 
            _start_at: collection.getMoment("2013-09-01T00:00:00+00:00"),
            a: 0.5,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ])
      } ]);
      view = new MultiStatItemView({
        collection: collection,
        stat: {
          "title": "Statistic A",
          "attr": "a"
        }                             
      });
    });
    
    it("calculates initial time period correctly", function () {

      jasmine.renderView(view, function () {
        expect(view.$el.find('.sparkline .stat-description').text()).toEqual('Past 31 days');
      });

    });
    
    it("calculates years correctly", function () {

      collection.first().get('values').first().set({'_start_at': collection.getMoment("2011-08-01T00:00:00+00:00")});
      jasmine.renderView(view, function () {
        expect(view.$el.find('.sparkline .stat-description').text()).toEqual('Past 2 years');
      });

    });
    
    it("calculates months and the singular version of the time label correctly", function () {

      collection.first().get('values').first().set({'_start_at': collection.getMoment("2013-07-29T00:00:00+00:00")});
      jasmine.renderView(view, function () {
        expect(view.$el.find('.sparkline .stat-description').text()).toEqual('Past 1 month');
      });

    });
    

  })
});
