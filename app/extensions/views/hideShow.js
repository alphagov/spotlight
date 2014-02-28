define([
  'extensions/views/view'
], function (View) {
  return View.extend({
    initialize: function (options) {
      options = options || {};
      this.showLabel = options.showLabel;
      this.hideLabel = options.hideLabel;
      this.shown = false;

      View.prototype.initialize.apply(this, arguments);

      this.render();
    },

    events: {
      'click a': 'showHide'
    },

    render: function () {
      this.$handle = $('<a href="#">' + this.showLabel + '</a>');
      this.$handle.insertBefore(this.$reveal);
    },

    showHide: function () {
      if (this.shown) {
        this.$reveal.hide();
        this.$handle.text(this.showLabel);
        this.shown = false;
      } else {
        this.$reveal.show();
        this.$handle.text(this.hideLabel);
        this.shown = true;
      }
      return false;
    }
  });
});
