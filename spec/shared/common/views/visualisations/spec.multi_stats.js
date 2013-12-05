define([
  'common/views/visualisations/multi_stats',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (MultiStatsView, Model, Collection) {
  describe("MultiStatsView", function () {
    
    var collection, view;
    beforeEach(function() { 
      collection = new Collection();
      collection.reset([{
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
      ]);
      view = new MultiStatsView({
        collection: collection,
        model: new Model({
          "stats": [
              {
                "title": "Statistic A",
                "attr": "a"
              },
              {
                "title": "Statistic B",
                "attr": "b",
                "format": "£{{ value }}"
              },
              {
                "title": "Statistic C",
                "attr": "c",
                "format": "{{ value }}%"
              },
              {
                "title": "Statistic D",
                "attr": "d",
                "format": "{{ value }}%"
              },
              {
                "title": "Statistic E",
                "attr": "e",
                "format": "{{ value }}%"
              },                                
            ]
        })
      });
    }), 
    
    it("renders sample data", function () {

      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li').length).toEqual(5);
        expect(view.$el.find('ul li:eq(0) h3')).toHaveText('Statistic A');
        expect(view.$el.find('ul li:eq(0) p.impact-number strong')).toHaveText('0.5');
        expect(view.$el.find('ul li:eq(0) p').text()).toContain('Sep 2013');
        expect(view.$el.find('ul li:eq(0) p.change')).toHaveText('−50.00%');
        expect(view.$el.find('ul li:eq(0) p.change')).toHaveClass('decrease');
        expect(view.$el.find('ul li:eq(0) p.previous-date')).toHaveText('Aug 2013');
        // Test formatters. 
        expect(view.$el.find('ul li:eq(4) p.impact-number strong')).toHaveText('0%');
      });
      
    });
      
    it("does not show deltas for collection of length 1", function () {
      
      collection.pop();
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li:eq(0) h3')).toHaveText('Statistic A');
        expect(view.$el.find('ul li:eq(0) p.impact-number strong')).toHaveText('1');
        expect(view.$el.find('ul li:eq(0) p.change').length).toEqual(0);
        expect(view.$el.find('ul li:eq(0) p.previous-date').length).toEqual(0);
      });
      
    });
    
    it("does not fail miserably for collection of length 0", function () {
      
      collection.pop();
      collection.pop();
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li').length).toEqual(0);
      });
      
    });
    
    it("does not show a percentage if the denominator is null", function () {
      
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li:eq(2) p.change').length).toEqual(0);
        expect(view.$el.find('ul li:eq(2) p.previous-date').length).toEqual(0);
      });
      
    });
    
    it("does not show a percentage if the denominator is zero", function () {
      
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li:eq(3) p.change').length).toEqual(0);
        expect(view.$el.find('ul li:eq(3) p.previous-date').length).toEqual(0);
      });
      
    });
    
    it("does show a percentage if the numerator is zero", function () {
      
      jasmine.renderView(view, function () {
        expect(view.$el.find('ul li:eq(4) p.change')).toHaveText('−100.00%');
        expect(view.$el.find('ul li:eq(4) p.previous-date')).toHaveText('Aug 2013');
      });
      
    });

  })
});
