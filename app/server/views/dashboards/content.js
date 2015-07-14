var DashboardView = require('../dashboard');

module.exports = DashboardView.extend({

  getPageHeader: function () {
    return this.model.get('title') + ': web traffic';
  },

  getSchemaOrgItemType: function () {
    return 'http://schema.org/GovernmentOrganization';
  }

});
