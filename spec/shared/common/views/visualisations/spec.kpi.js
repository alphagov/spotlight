define([
  'common/views/visualisations/kpi',
  'extensions/models/model',
  'extensions/collections/collection'
], function (KPIView, Model, Collection) {

  describe('KPIView', function () {

    var kpi;

    beforeEach(function () {
      kpi = new KPIView({
        model: new Model({
          valueAttr: 'value',
          format: 'currency'
        }),
        collection: new Collection([
          { value: 1100 },
          { value: 1000 }
        ])
      });
    });

    describe('render', function () {

      it('formats kpi value', function () {
        kpi.render();
        expect(kpi.$('.single-stat-headline strong').text()).toEqual('£1,100');
      });

      it('loads property from model valueAttr', function () {
        kpi.collection.at(0).set('foo', 2);
        kpi.collection.at(1).set('foo', 2);
        kpi.model.set('valueAttr', 'foo');
        kpi.render();
        expect(kpi.$('.single-stat-headline strong').text()).toEqual('£2');
      });

      it('adds a percentage change', function () {
        kpi.render();
        expect(kpi.$('.single-stat-headline strong').text()).toEqual('£1,100');
      });

      it('applies default formatting of `number` if none is provided', function () {
        kpi.model.unset('format');
        kpi.render();
        expect(kpi.$('.delta .change').text()).toEqual('10%');
        expect(kpi.$('.delta .change').hasClass('increase')).toBe(true);
        expect(kpi.$('.delta .change').hasClass('decrease')).toBe(false);
      });

      it('renders "no data" is no data is present', function () {
        kpi.collection.reset([
          {},
          {}
        ]);
        kpi.render();
        expect(kpi.$('.single-stat-headline strong').text()).toEqual('no data');
      });

      it('does not add delta section if no data is present', function () {
        kpi.collection.reset([
          {},
          {}
        ]);
        kpi.render();
        expect(kpi.$('.delta').length).toEqual(0);
      });

    });

  });

});
