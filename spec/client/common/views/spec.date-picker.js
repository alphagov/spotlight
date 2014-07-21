define([
  'client/views/date-picker',
  'extensions/models/model',
  'extensions/collections/collection'
], function (DatePicker, Model, Collection) {

  describe('Date Picker', function () {

    var datepicker, model, collection, now;

    beforeEach(function () {
      now = undefined;
      collection = new Collection([
        {'_end_at': '2014-03-04T01:00:00Z'},
        {'_end_at': '2014-03-11T01:00:00Z'},
        {'_end_at': '2014-03-18T01:00:00Z'},
        {'_end_at': '2014-03-25T01:00:00Z'},
        {'_end_at': '2014-04-01T01:00:00Z'}
      ]);

      collection.dataSource.setQueryParam('period', 'month');
      model = new Model({
        'date-picker': {}
      });
      spyOn(DatePicker.prototype, 'getMoment').andCallFake(function (d) {
        if (d) {
          return this.moment(d).utc();
        } else {
          return this.moment(now).utc();
        }
      });
      datepicker = new DatePicker({
        model: model,
        collection: collection
      });
    });

    describe('initialize', function () {

      it('sets start date from model if it exists', function () {
        model.set('date-picker', {
          'start-date': '2014-04-01T00:00:00Z'
        });
        datepicker = new DatePicker({
          model: model,
          collection: collection
        });
        expect(datepicker.lowerBound).toEqual('2014-04-01T00:00:00Z');
      });

    });

    describe('render', function () {

      beforeEach(function () {
        now = '2014-07-18T01:02:03Z';
        datepicker.render();
      });

      it('adds a pair of select boxes', function () {
        expect(datepicker.$('select').length).toEqual(2);
        expect(datepicker.$('select').eq(0).attr('id')).toEqual('date-from');
        expect(datepicker.$('select').eq(1).attr('id')).toEqual('date-to');
      });

      it('sets the upper bound of the "from" select to previous month', function () {
        expect(datepicker.$('#date-from option').eq(0).attr('value')).toEqual('2014-06-01T00:00:00Z');
      });

      it('sets the upper bound of the "to" select to current month', function () {
        expect(datepicker.$('#date-to option').eq(0).attr('value')).toEqual('2014-07-01T00:00:00Z');
      });

      it('selects the lower bound of the collection in the "from" select', function () {
        expect(datepicker.$('#date-from').val()).toEqual('2014-03-01T00:00:00Z');
      });

      it('selects the upper bound of the collection in the "to" select', function () {
        expect(datepicker.$('#date-to').val()).toEqual('2014-04-01T00:00:00Z');
      });

    });

    describe('events', function () {

      beforeEach(function () {
        spyOn(collection.dataSource, 'setQueryParam').andCallThrough();
        datepicker.render();
      });

      it('writes the start and end dates to the collection datasource on change', function () {

        datepicker.$('#date-from').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-to').val('2014-06-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(collection.dataSource.setQueryParam).toHaveBeenCalledWith({
          start_at: '2013-06-01T00:00:00Z',
          // end at is rounded to the end of the month to fully encompass the data
          end_at: '2014-06-30T23:59:59Z'
        });

      });

      it('if period of collection is "week", rounds dates to mondays', function () {

        collection.dataSource.setQueryParam('period', 'week');

        datepicker.$('#date-from').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-to').val('2014-05-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(collection.dataSource.setQueryParam).toHaveBeenCalledWith({
          start_at: '2013-05-27T00:00:00Z',
          end_at: '2014-06-01T23:59:59Z'
        });

      });

      it('sets end date to current date if end date is after current date', function () {

        now = '2014-07-18T01:02:03Z';

        datepicker.$('#date-from').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-to').val('2014-07-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(collection.dataSource.setQueryParam).toHaveBeenCalledWith({
          start_at: '2013-06-01T00:00:00Z',
          end_at: '2014-07-18T01:02:03Z'
        });

      });

    });

    describe('error messaging', function () {

      beforeEach(function () {
        datepicker.render();
      });

      it('shows an error message when start date is selected after end date', function () {

        datepicker.$('#date-from').val('2014-07-01T00:00:00Z');
        datepicker.$('#date-to').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(datepicker.$('.warning').text()).toEqual('Start date must be before end date');

      });

      it('removes message if dates are set back to an appropriate order', function () {

        datepicker.$('#date-from').val('2014-07-01T00:00:00Z');
        datepicker.$('#date-to').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(datepicker.$('.warning').length).toEqual(1);

        datepicker.$('#date-from').val('2013-06-01T00:00:00Z');
        datepicker.$('#date-to').val('2014-07-01T00:00:00Z');
        datepicker.$('#date-from').change();

        expect(datepicker.$('.warning').length).toEqual(0);

      });

    });

  });

});
