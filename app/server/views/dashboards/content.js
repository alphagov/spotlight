var DashboardView = require('../dashboard');

module.exports = DashboardView.extend({

  getBreadcrumbCrumbs: function () {
    var crumbs = DashboardView.prototype.getBreadcrumbCrumbs.apply(this, arguments);

    if (this.model.get('slug') !== 'site-activity') {
      crumbs.push({ title: 'Activity on GOV.UK' });
    }

    crumbs.push({ title: this.model.get('title') });

    return crumbs;
  },

  getPageHeader: function () {
    return this.model.get('title') + ': web traffic';
  }

});
