define([
  'common/views/visualisations/most-recent-number',
  'extensions/collections/collection',
  'extensions/models/model'
],
  function (MostRecentNumber, Collection, Model) {

    describe('MostRecentNumber', function () {

      var collection, view, model;
      var data = [
        {
          '_start_at': '2014-01-01T00:00:00+00:00',
          '_end_at': '2014-04-01T00:00:00+00:00',
          'number_of_transactions': 971867,
          'digital_takeup': 0.63
        },
        {
          '_start_at': '2014-04-01T00:00:00+00:00',
          '_end_at': '2014-07-01T00:00:00+00:00',
          'number_of_transactions': 1022777,
          'digital_takeup': 0.78
        }
      ];
      var incompleteData = [
        {
          '_start_at': '2014-01-01T00:00:00+00:00',
          '_end_at': '2014-04-01T00:00:00+00:00',
          'number_of_transactions': 971867,
          'digital_takeup': 0.63
        },
        {
          '_start_at': '2014-04-01T00:00:00+00:00',
          '_end_at': '2014-07-01T00:00:00+00:00',
          'number_of_transactions': null,
          'digital_takeup': null
        }
      ];
      var nullData = [
        {
          '_start_at': '2014-01-01T00:00:00+00:00',
          '_end_at': '2014-04-01T00:00:00+00:00',
          'number_of_transactions': null,
          'digital_takeup': null
        },
        {
          '_start_at': '2014-04-01T00:00:00+00:00',
          '_end_at': '2014-07-01T00:00:00+00:00',
          'number_of_transactions': null,
          'digital_takeup': null
        }
      ];

      beforeEach(function () {
        model = new Model();
        model.set('axis-period', 'quarter');
        collection = new Collection();
        collection.reset({ data: data }, { parse: true });
        view = new MostRecentNumber({
          collection: collection,
          model: model
        });
        view.valueAttr = 'number_of_transactions';
        view.formatOptions = { 'type': 'integer', 'magnitude': 'true' };
      });

      describe('getValue', function () {

        it('displays value for most recent period if available', function () {
          expect(view.getValue()).toEqual('1.02m');
        });

        it('displays value for earlier period if most recent period not available', function () {
          collection.reset({ data: incompleteData }, { parse: true });
          view = new MostRecentNumber({
            collection: collection,
            model: model
          });
          view.valueAttr = 'number_of_transactions';
          view.formatOptions = { 'type': 'integer', 'magnitude': 'true' };
          expect(view.getValue()).toEqual('972k');
        });

        it('displays percentage values when percent option is set', function () {
          view.valueAttr = 'digital_takeup';
          view.formatOptions = { 'type': 'percent' };
          expect(view.getValue()).toEqual('78%');
        });

        it('displays (no data) when there is no data available', function () {
          collection.reset({ data: nullData }, { parse: true });
          view = new MostRecentNumber({
            collection: collection,
            model: model
          });
          view.valueAttr = 'number_of_transactions';
          view.formatOptions = { 'type': 'integer', 'magnitude': 'true' };
          view.render();

          expect(view.$el.html()).toEqual('<span class="no-data">(no data)</span>');
        });
      });


      describe('getValueSelected', function () {
        it('displays value for selected period', function () {

          collection.reset({ data: data }, { parse: true });
          view = new MostRecentNumber({
            collection: collection,
            model: model
          });
          view.valueAttr = 'number_of_transactions';
          view.formatOptions = { 'type': 'integer', 'magnitude': 'true' };

          var selection = new Model();
          selection.set('number_of_transactions', 1000000);

          expect(view.getValueSelected({ selectedModel: selection })).toEqual('1m');
        });

        it('displays percentage values when percent option is set', function () {

          collection.reset({ data: data }, { parse: true });
          view = new MostRecentNumber({
            collection: collection,
            model: model
          });
          view.valueAttr = 'digital_takeup';
          view.formatOptions = { 'type': 'percent' };

          var selection = new Model();
          selection.set('digital_takeup', 0.87);

          expect(view.getValueSelected({ selectedModel: selection })).toEqual('87%');
        });

        it('should select null when the selected model has no data available', function () {

          var selection = new Model();
          selection.set('number_of_transactions', null);

          expect(view.getValueSelected({ selectedModel: selection })).toEqual(null);
        });
      });

      describe('getLabel', function () {
        it('displays formatted label for most recent period', function () {

          expect(view.getLabel()).toEqual('Apr to June 2014');
        });

        it('should display no label when there is no data available', function () {
          collection.reset({ data: nullData }, { parse: true });
          view = new MostRecentNumber({
            collection: collection,
            model: model
          });
          view.valueAttr = 'number_of_transactions';
          view.formatOptions = { 'format': { 'type': 'integer' }};
          view.render();

          expect(view.$el.html()).toEqual('<span class="no-data">(no data)</span>');
        });
      });


      describe('getLabelSelected', function () {
        it('displays formatted label for selected period', function () {

          var selection = new Model();
          selection.set('_start_at', view.getMoment('2014-01-01T00:00:00+00:00'));
          selection.set('_end_at', view.getMoment('2014-04-01T00:00:00+00:00'));

          expect(view.getLabelSelected({ selectedModel: selection })).toEqual('Jan to Mar 2014');
        });

      });
    });
  });
