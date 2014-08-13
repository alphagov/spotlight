define([
  'client/views/visualisations/sparkline',
  'extensions/collections/collection',
  'backbone'
], function (SparklineView, Collection, Backbone) {

  describe('Sparkline', function () {

    var view;

    beforeEach(function () {
      spyOn(SparklineView.prototype, 'render');
      view = new SparklineView({
        model: new Backbone.Model(),
        collection: new Collection()
      });
    });

    describe('modelToDate', function () {

      it('returns model timestamp property', function () {
        expect(view.modelToDate(new Backbone.Model({
          _timestamp: '2014-01-01T12:00:00Z'
        }))).toEqual('2014-01-01T12:00:00Z');
      });

    });

    describe('minValue', function () {

      it('returns zero for an empty dataset', function () {
        expect(view.minValue()).toEqual(0);
      });

      it('returns the minimum value of valueAttr from the collection', function () {

        view.collection.reset([
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
        ]);

        expect(view.minValue()).toEqual(90);

        view.valueAttr = 'alternativeValue';

        expect(view.minValue()).toEqual(222);

      });

    });

  });

});