define([
  'extensions/views/single_stat',
  'common/views/visualisations/headline',
  'extensions/collections/collection'
],
function (SingleStatView, HeadlineView, Collection) {
  describe('HeadlineView', function () {

    var collection, view;
    beforeEach(function () {
      collection = new Collection();
      collection.reset({
        data: [
          {
            _start_at: collection.getMoment('2013-08-01T00:00:00+00:00'),
            a: 1,
            b: 2,
            c: null,
            d: 0,
            e: 5
          },
          {
            _start_at: collection.getMoment('2013-09-01T00:00:00+00:00'),
            a: 0.5,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ]
      }, { parse: true });
      view = new HeadlineView({
        collection: collection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a'
      });
    });

    it('renders sample data', function () {

      jasmine.renderView(view, function () {
        expect(view.$el.find('strong')).toHaveText('0.5');
        expect(view.$el.text()).toContain('Sep 2013');
      });

    });

    it('indicates missing data', function () {

      collection.last().set('a', null);
      jasmine.renderView(view, function () {
        expect(view.$el.find('strong').length).toEqual(0);
        expect(view.$el.text()).toContain('(no data)');
      });

    });

    it('indicates missing data', function () {

      collection.last().set('a', null);
      jasmine.renderView(view, function () {
        expect(view.$el.find('strong').length).toEqual(0);
        expect(view.$el.text()).toContain('(no data)');
      });

    });

    it('uses the timeAttr option if it is passed', function () {

      var testCollection, testView;
      testCollection = new Collection();
      testCollection.reset({
        data: [
          {
            _timestamp: testCollection.getMoment('2013-08-01T00:00:00+00:00'),
            a: 1,
            b: 2,
            c: null,
            d: 0,
            e: 5
          },
          {
            _timestamp: testCollection.getMoment('2013-09-01T00:00:00+00:00'),
            a: 0.5,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ]
      }, { parse: true });
      testView = new HeadlineView({
        collection: testCollection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a',
        timeAttr: '_timestamp'
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('strong')).toHaveText('0.5');
        expect(testView.$el.text()).toContain('Sep 2013');
      });

    });

    it('renders a percentage value if isPercent is passed', function () {

      var testCollection, testView;
      testCollection = new Collection();
      testCollection.reset({
        data: [
          {
            _timestamp: testCollection.getMoment('2013-08-01T00:00:00+00:00'),
            a: 1,
            b: 2,
            c: null,
            d: 0,
            e: 5
          },
          {
            _timestamp: testCollection.getMoment('2013-09-01T00:00:00+00:00'),
            a: 0.5,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ]
      }, { parse: true });
      testView = new HeadlineView({
        collection: testCollection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a',
        timeAttr: '_timestamp',
        isPercent: true
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('strong')).toHaveText('50%');
        expect(testView.$el.text()).toContain('Sep 2013');
      });

    });

  });

});
