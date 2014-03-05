define([
  'extensions/views/view'
], function (View) {
  return View.extend({
    initialize: function (options) {
      options = options || {};
      this.showLabel = options.showLabel;
      this.hideLabel = options.hideLabel;
      this.$reveal = options.$reveal;
      this.className = options.className || '';

      View.prototype.initialize.apply(this, arguments);

      this.render();
    },

    events: {
      'click a': 'showHide'
    },

    render: function () {
      this.$handle = $('<a>', {
        'class': this.className,
        'href': '#',
        'text': this.showLabel
      });
      this.$handle.insertBefore(this.$reveal);
    },

    showHide: function (e) {
      if (this.$reveal.is(':visible')) {
        this.$reveal.hide();
        this.$handle.text(this.showLabel);
      } else {
        this.$reveal.show();
        this.$handle.text(this.hideLabel);
      }
      e.preventDefault();
    }
  });
});
