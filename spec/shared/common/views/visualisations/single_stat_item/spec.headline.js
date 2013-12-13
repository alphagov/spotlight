define([
  'extensions/views/single_stat',
  'common/views/visualisations/multi_stat_item/single_stat_item/headline',
  'extensions/collections/collection',
  'Mustache'
],
function (SingleStatView, HeadlineView, Collection, Mustache) {
  describe("HeadlineView", function () {

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
    view = new HeadlineView({
      collection: collection,
      stat: {
        "title": "Statistic A",
        "attr": "a"
      },
      valueAttr: "a"
    });
  });
  
  it("renders sample data", function () {

    jasmine.renderView(view, function () {
      expect(view.$el.find('strong')).toHaveText('0.5');
      expect(view.$el.text()).toContain('Sep 2013');
    });

  });

  it("indicates missing data", function () {
    
    collection.first().get('values').last().set('a', null);
    jasmine.renderView(view, function () {
      expect(view.$el.find('strong').length).toEqual(0);
      expect(view.$el.text()).toContain('(no data)');
    });
    
  });
  
  it("indicates missing data", function () {
    
    collection.first().get('values').last().set('a', null);
    jasmine.renderView(view, function () {
      expect(view.$el.find('strong').length).toEqual(0);
      expect(view.$el.text()).toContain('(no data)');
    });
    
  });
 
 }); 
});
