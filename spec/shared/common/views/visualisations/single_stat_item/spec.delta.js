define([
  'common/views/visualisations/delta',
  'extensions/models/model',
  'extensions/collections/collection'
],
function (DeltaView, Model, Collection) {
  describe('DeltaView', function () {

    var collection, view;
    beforeEach(function () {
      collection = new Collection()
      collection.reset({
        data: [
          {
            _start_at: '2012-09-01T00:00:00+00:00',
            a: 1,
            b: 2,
            c: null,
            d: 0,
            e: 5
          },
          {
            _start_at: '2013-09-01T00:00:00+00:00',
            a: 0.5,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ]
      }, { parse: true });

      view = new DeltaView({
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
        expect(view.$el.find('.change')).toHaveText('−50.00%');
        expect(view.$el.text()).toContain('Sep 2012');
      });

    });

    it('correctly applies increase and decrease classes to the number', function () {

      jasmine.renderView(view, function () {
        expect(view.$el.find('.change')).toHaveClass('decrease');
      });

    });

    it('includes colour classes if specified, but not otherwise', function () {

      var testColourView = new DeltaView({
        collection: collection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a',
        showColours: true
      });

      jasmine.renderView(view, function () {
        expect(view.$el.find('.change')).not.toHaveClass('decline');
      });

      jasmine.renderView(testColourView, function () {
        expect(testColourView.$el.find('.change')).toHaveClass('decline');
      });

    });

    it('correctly applies no-change classes to the number, based on the value displayed', function () {

      var testNoChangeCollection = new Collection();
      testNoChangeCollection.reset({
        data: [
          {
            _start_at: collection.getMoment('2012-09-01T00:00:00+00:00'),
            a: 1,
            b: 2,
            c: null,
            d: 0,
            e: 5
          },
          {
            _start_at: collection.getMoment('2013-09-01T00:00:00+00:00'),
            a: 0.9999999,
            b: 4,
            c: 6,
            d: 10,
            e: 0
          }
        ]
      }, { parse: true });
      var testNoChangeView = new DeltaView({
        collection: testNoChangeCollection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a'
      });

      jasmine.renderView(testNoChangeView, function () {
        expect(testNoChangeView.$el.find('.change')).toHaveClass('no-change');
      });

    });

    it('does not show a delta if the denominator is null', function () {
      collection.first().set('a', null);
      jasmine.renderView(view, function () {
        expect(view.$el.find('span')).toHaveClass('no-data');
      });
    });

    it('does not show a delta if the denominator is zero', function () {

      collection.first().set('a', 0);
      jasmine.renderView(view, function () {
        expect(view.$el.find('span')).toHaveClass('no-data');
      });
    });

    it('does show a delta if the numerator is zero', function () {
      collection.last().set('a', 0);
      jasmine.renderView(view, function () {
        expect(view.$el.find('.change').text()).toContain('−100.00%');
      });
    });

    it('uses the timeAttr option if it is passed', function () {

      var testCollection, testView;

      testCollection = new Collection();
      testCollection.reset({
        data: [
          {
            _timestamp: testCollection.getMoment('2012-09-01T00:00:00+00:00'),
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
      testView = new DeltaView({
        collection: testCollection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a',
        timeAttr: '_timestamp'
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('.change')).toHaveText('−50.00%');
        expect(testView.$el.text()).toContain('Sep 2012');
      });

    });

    it('uses delta and deltaPeriod if passed', function () {

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
      testView = new DeltaView({
        collection: testCollection,
        stat: {
          'title': 'Statistic A',
          'attr': 'a'
        },
        valueAttr: 'a',
        timeAttr: '_timestamp',
        delta: 1,
        deltaPeriod: 'months'
      });

      jasmine.renderView(testView, function () {
        expect(testView.$el.find('.change')).toHaveText('−50.00%');
        expect(testView.$el.text()).toContain('Aug 2013');
      });

    });


  });

});
