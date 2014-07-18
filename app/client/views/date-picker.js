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
      var from = this.$('#date-from').val();
      var to = this.$('#date-to').val();

      this.collection.dataSource.setQueryParam({
        start_at: from,
        end_at: this.getMoment(to).add('months', 1),
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