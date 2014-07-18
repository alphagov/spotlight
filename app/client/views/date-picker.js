define([
  'extensions/views/view'
], function (View) {
  return View.extend({

    startDate: '2013-04-01T00:00:00Z',
    dateFormat: 'YYYY-MM-DD[T]HH:mm:ss[Z]',

    events: {
      'change select': 'update'
    },

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      var options = this.model.get('date-picker') || {};
      if (options['start-date']) {
        this.startDate = options['start-date'];
      }
    },

    update: function () {
      var from = this.getMoment(this.$('#date-from').val());
      var to = this.getMoment(this.$('#date-to').val());
      var now = this.getMoment();
      var period = this.collection.getPeriod();

      from = from.startOf(period);
      to = to.endOf('month');

      if (to.isAfter(this.getMoment())) {
        to = this.getMoment();
      }

      if (period === 'week') {
        from = from.add('day', 1);
      }

      this.collection.dataSource.setQueryParam({
        start_at: from.format(this.dateFormat),
        end_at: to.format(this.dateFormat),
      });
    },

    render: function () {
      var from = this.makeSelect({ id: 'date-from' });
      var to = this.makeSelect({ id: 'date-to' });

      this.$el.append('Show data from: ').append(from).append(' to ').append(to);
    },

    makeSelect: function (attrs) {
      var $select = $('<select/>', attrs);
      var date = this.getMoment(this.startDate);
      var now = this.getMoment();

      while (date.isBefore(now)) {
        var option = '<option value="' + date.format(this.dateFormat) + '">' + date.format('MMM YYYY') + '</option>';
        $select.prepend(option);
        date = date.add('month', 1);
      }

      return $select;
    }

  });
});