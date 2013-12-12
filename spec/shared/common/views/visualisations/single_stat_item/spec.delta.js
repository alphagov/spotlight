define([
  'common/views/visualisations/multi_stat_item/single_stat_item/delta',
  'extensions/models/model',
  'extensions/collections/collection',
  'Mustache'
],
function (DeltaView, Model, Collection, Mustache) {
  describe("DeltaView", function () {
  
  var collection, view;
  beforeEach(function() { 
    collection = new Collection();
    collection.reset([ {
      id: 'test',
      title: 'test',
      values: new Collection([
        {
          _start_at: collection.getMoment("2012-09-01T00:00:00+00:00"),
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
    
    view = new DeltaView({
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
      expect(view.$el.find('.change')).toHaveText('−50.00%');
      expect(view.$el.text()).toContain('Sep 2012');
    });

  });
  
  it("correctly applies increase and decrease classes to the number", function () {

    jasmine.renderView(view, function () {
      expect(view.$el.find('.change')).toHaveClass('decrease');
    });

  });

  
  it("does not show a delta if the denominator is null", function () {
    collection.first().get('values').first().set('a', null);
    jasmine.renderView(view, function () {
      expect(view.$el.find('span')).toHaveClass('no-data');
    });
  });

  it("does not show a delta if the denominator is zero", function () {
    
    collection.first().get('values').first().set('a', 0);
    jasmine.renderView(view, function () {
      expect(view.$el.find('span')).toHaveClass('no-data');
    });
  });

  it("does show a delta if the numerator is zero", function () {
    collection.first().get('values').last().set('a', 0);
    jasmine.renderView(view, function () {
      expect(view.$el.find('.change').text()).toContain('−100.00%');
    });
  });
 
 }); 
});
