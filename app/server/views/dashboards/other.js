var DashboardView = require('../dashboard');

module.exports = DashboardView.extend({

  getContext: function () {
    var context = DashboardView.prototype.getContext.apply(this, arguments);
    return _.extend(context, {
      hasFooter: true
    });
  },

  getTagline: function () {
    return this.model.get('description');
  }

});
