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
          'value-attribute': 'value',
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

      it('formats date period', function () {
        var dateKpi = new KPIView({
          model: new Model({
            valueAttr: 'value',
            format: 'currency'
          }),
          collection: new Collection([
            {
              value: 1100,
              _timestamp: '2014-01-01T00:00:00+00:00',
              end_at: '2015-01-01T00:00:00+00:00'
            },
            { value: 1000 }
          ])
        });
        dateKpi.render();
        expect(dateKpi.$('.period').text()).toEqual('Jan 2014 to Dec 2014');
      });

      it('formats date period for week', function () {
        var dateKpi = new KPIView({
          model: new Model({
            valueAttr: 'value',
            format: 'currency',
            'date-period': 'week'
          }),
          collection: new Collection([
            {
              value: 1100,
              _timestamp: '2014-03-24T00:00:00+00:00',
              end_at: '2014-03-31T00:00:00+00:00'
            },
            { value: 1000 }
          ])
        });
        dateKpi.render();
        expect(dateKpi.$('.period').text()).toEqual('24 Mar 2014 to 30 Mar 2014');
      });

      it('fails gracefully if there is no data', function () {
        var dateKpi = new KPIView({
          model: new Model({
            valueAttr: 'value',
            format: 'currency'
          }),
          collection: new Collection([])
        });
        dateKpi.render();
        expect(dateKpi.$('.single-stat-headline').text().trim()).toEqual('no data');
      });

      it('loads property from model value attribute', function () {
        kpi.collection.at(0).set('foo', 2);
        kpi.collection.at(1).set('foo', 2);
        kpi.model.set('value-attribute', 'foo');
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
        expect(kpi.$('.delta .change').text().trim()).toEqual('10%');
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

      it('does not add delta section if only one value present', function () {
        kpi.collection.reset([
          { value: 1100 }
        ]);
        kpi.render();
        expect(kpi.$('.delta').length).toEqual(0);
      });

      it('has a no-change class if the data is unchanged', function () {
        kpi.collection.reset([
          { value: 1100 },
          { value: 1100 }
        ]);
        kpi.render();
        expect(kpi.$('.delta .change').hasClass('no-change')).toBe(true);
      });

      it('does not attempt to calculate the delta if the previous value is zero', function () {
        kpi.collection.reset([
          { value: 1100 },
          { value: 0 }
        ]);
        kpi.render();
        expect(kpi.$('.delta').length).toEqual(0);
      });

      it('renders data in the delta section if the latest data point is empty but the penultimate data point is not', function () {
        kpi.collection.reset([
          {},
          {
            value: 1100,
            _timestamp: '2014-03-01T00:00:00+00:00',
            end_at: '2014-04-01T00:00:00+00:00'
          }
        ]);
        kpi.render();
        expect(kpi.$('.delta').text()).toContain('£1,100');
        expect(kpi.$('.delta').text()).toContain('Mar 2014 to Mar 2014');
      });

    });

  });

});
