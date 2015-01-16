var path = require('path');

var templatePath = path.resolve(__dirname, '../templates/homepage.html');

var BaseView = require('./govuk');

module.exports = BaseView.extend({

  getPageTitle: function () {
    return 'Our performance - GOV.UK';
  },

  getBreadcrumbCrumbs: function () {
    return [];
  },

  getContent: function () {

    // the GOV.UK content dashboard should be removed from the list
    // as it has an explicit link in the homepage template
    var contentDashboards = this.collection.filterDashboards('content');

    contentDashboards = _.filter(contentDashboards, function (dashboard) {
      return dashboard.slug !== 'site-activity';
    });

    return this.loadTemplate(templatePath, _.extend({
      services: this.collection.filterDashboards('transaction', 'other'),
      serviceGroups: this.collection.filterDashboards('service-group'),
      highVolumeServices: this.collection.filterDashboards('high-volume-transaction'),
      contentDashboards: contentDashboards
    }, this.model.toJSON()));

  }

});
