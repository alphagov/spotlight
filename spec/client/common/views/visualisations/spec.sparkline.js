define([
  'common/views/visualisations/sparkline',
  'extensions/collections/collection',
  'backbone'
], function (SparklineView, Collection, Backbone) {

  describe('Sparkline', function () {

    var view;

    beforeEach(function () {
      view = new SparklineView({
        model: new Backbone.Model(),
        collection: new Collection()
      });
    });

    describe('getPeriod', function () {

      it('returns hour by default', function () {
        expect(view.getPeriod()).toEqual('hour');
      });

      it('returns view\'s period property if set', function () {
        view.period = 'week';
        expect(view.getPeriod()).toEqual('week');
      });

      it('returns model\'s period property if set', function () {
        view.model.set('period', 'day');
        expect(view.getPeriod()).toEqual('day');
      });

    });

    describe('minValue', function () {

      it('returns zero for an empty dataset', function () {
        expect(view.minValue()).toEqual(0);
      });

      it('returns the minimum value of valueAttr from the collection', function () {

        view.collection.reset([
          {
            values: new Collection([
              {
                _count: 90,
                alternativeValue: 444
              },
              {
                _count: 100,
                alternativeValue: 333
              },
              {
                _count: 114,
                alternativeValue: 222
              }
            ])
          },
          {
            values: new Collection([
              {
                _count: 1,
                alternativeValue: 100
              },
              {
                _count: 6,
                alternativeValue: 99
              },
              {
                _count: 11,
                alternativeValue: 98
              }
            ])
          },
          {
            values: new Collection([
              {
                _count: 2,
                alternativeValue: 80
              },
              {
                _count: 7,
                alternativeValue: 87
              },
              {
                _count: 12,
                alternativeValue: 23
              }
            ])
          }
        ]);

        expect(view.minValue()).toEqual(1);

        view.valueAttr = 'alternativeValue';

        expect(view.minValue()).toEqual(23);

      });

    });

  });

});