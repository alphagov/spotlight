define([
  './date-picker'
], function (DatePicker) {

  return DatePicker.extend({

    interval: 'week',

    update: function () {
      var to = this.getMoment(this.$('#date-to').val()).day(this.MONDAY);
      var from = to.clone().subtract(this.interval, 1);

      this.setHashParams({
        to: this.$('#date-to').val()
      });

      this.collection.dataSource.setQueryParam({
        start_at: from.format(this.dateFormat),
        end_at: to.format(this.dateFormat),
      });
    },

    render: function () {
      var hashParams = this.getHashParams();

      var selected = hashParams.to;

      var to = this.makeSelect({ id: 'date-to' }, {
        format: 'DD MMM YYYY',
        selected: this.getMoment(selected).startOf(this.interval).format(this.dateFormat)
      });

      this.$el.append('Show data from week ending: ').append(to);

      if (selected) {
        this.update();
      }

    }

  });

});