define([
  'common/views/visualisations/volumetrics/percentage',
  'extensions/views/view',
  'extensions/collections/collection'
],
function (PercentageView, View, Collection) {
  describe('PercentageView', function () {

    var view, collection;

    beforeEach(function () {
      collection = new Collection();
      collection.reset({
        data: [
          { count: 2, goal: 1 , values: [
            { count: 1 },
            { count: 2 }
          ]},
          { count: 2, goal: 2, values: [
            { count: 1 },
            { count: 2 }
          ]},
          { count: 2, goal: 3 , values: [
            { count: 2 },
            { count: 2 }
          ]},
          { count: 2, goal: 3 , values: [
            { count: 1 },
            { count: 2 }
          ]}
        ]
      }, { parse: true });
      view = new PercentageView({
        collection: collection,
        valueAttr: 'count',
        target: 3,
        pinTo: 'goal'
      });
    });

    afterEach(function () {
      view.remove();
    });

    describe('getTargetPercent()', function () {

      it('should calculate the percentage targetvalue from the collection', function () {
        expect(view.getTargetPercent()).toEqual(0.5);
      });

      it('should calculate the percentage targetvalue from the collections previosModel', function () {
        expect(view.getTargetPercent(true)).toEqual(0.6);
      });

    });

  });
});
