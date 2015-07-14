var DashboardView = require('../dashboard');

module.exports = DashboardView.extend({

  getTagline: function () {
    return 'This dashboard shows information about how ' +
            'selected services run by the <strong>' +
            this.model.get('title') +
            '</strong> are currently performing.';
  },

});
