var requirejs = require('requirejs');

var View = requirejs('extensions/views/view');

module.exports = View.extend({

  render: function () {
    View.prototype.render.apply(this, arguments);
    this.$el.attr('data-src', this.fallbackUrl);
  }

});