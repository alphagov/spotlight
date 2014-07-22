define([
  'extensions/views/view'
], function (View) {
  return View.extend({

    lowerBound: '2013-04-01T00:00:00Z',
    dateFormat: 'YYYY-MM-DD[T]HH:mm:ss[Z]',

    events: {
      'change select': 'update'
    },

    initialize: function () {
      View.prototype.initialize.apply(this, arguments);
      var options = this.model.get('date-picker') || {};
      if (options['start-date']) {
        this.lowerBound = options['start-date'];
      }
    },

    update: function () {
      var from = this.getMoment(this.$('#date-from').val());
      var to = this.getMoment(this.$('#date-to').val());
      var now = this.getMoment();
      var period = this.collection.getPeriod();

      if (from.isAfter(to)) {
        this.showError('Start date must be before end date');
      } else {
        this.setHashParams({
          from: this.$('#date-from').val(),
          to: this.$('#date-to').val()
        });

        from = from.startOf(period);
        to = to.endOf('month');

        if (to.isAfter(now)) {
          to = now;
        }

        if (period === 'week') {
          from = from.add('day', 1);
          to = to.endOf('week').add('day', 1);
        }

        this.hideError();
        this.collection.dataSource.setQueryParam({
          start_at: from.format(this.dateFormat),
          end_at: to.format(this.dateFormat),
        });
      }

    },

    render: function () {
      var hashParams = this.getHashParams();
      var firstDate = hashParams.from || this.collection.first().get('_end_at');
      var lastDate = hashParams.to || this.collection.last().get('_end_at');
      var from = this.makeSelect({ id: 'date-from' }, {
        selected: this.getMoment(firstDate).startOf('month').format(this.dateFormat),
        upperBound: this.getMoment().subtract('months', 1).startOf('month')
      });
      var to = this.makeSelect({ id: 'date-to' }, {
        selected: this.getMoment(lastDate).startOf('month').format(this.dateFormat)
      });

      this.$el.append('Show data from: ').append(from).append(' to ').append(to);

      if ('from' in hashParams || 'to' in hashParams) {
        this.update();
      }
    },

    makeSelect: function (attrs, options) {
      options = options || {};
      _.defaults(options, {
        lowerBound: this.lowerBound
      });

      var $select = $('<select/>', attrs);
      var date = this.getMoment(options.lowerBound).startOf('month');
      var now = this.getMoment(options.upperBound).startOf('month');

      while (!date.isAfter(now)) {
        var option = '<option value="' + date.format(this.dateFormat) + '">' + date.format('MMM YYYY') + '</option>';
        $select.prepend(option);
        date = date.add('month', 1);
      }

      $select.val(options.selected);

      return $select;
    },

    showError: function (msg) {
      this.hideError();
      var $error = $('<p/>').addClass('error').text(msg);
      this.$el.prepend($error);
    },

    hideError: function () {
      this.$('.error').remove();
    }

  });
});