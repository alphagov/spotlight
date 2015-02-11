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

  getBodyClasses: function() {
    return 'homepage';
  },

  getContent: function () {

    return this.loadTemplate(templatePath, _.extend({
      services: this.collection,
      serviceCount: this.collection.length,
      webTrafficCount: this.contentDashboards.length
    }, this.model.toJSON()));

  }

});
