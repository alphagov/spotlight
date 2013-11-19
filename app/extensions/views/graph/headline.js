define([
  'extensions/views/view'
],
  function (View) {
    var HeadlineView = View.extend({
      initialize: function () {
        View.prototype.initialize.apply(this, arguments);
        this.model.on('change', this.render, this);
      },

      prefix: 'Total forms received',
      postfix: '',

      headliner: function (period, duration) {
        return [this.prefix, 'per', period, 'over the last',
          duration, period + 's', this.postfix].join(' ');
      },

      render: function () {
        var period = this.model.get('period');
        var headline = this.headliner(period, this.model.periods[this.model.get('period')].duration);
        this.$el.html(headline);
      }
    });

    return HeadlineView;
  });
