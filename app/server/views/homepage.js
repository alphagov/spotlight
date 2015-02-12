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

  formatKpis: function(services) {
    _.each(services, function (service) {
      _.each(this.collection.options.axes.y, function(kpi) {
        if (service[kpi.key] === null) {
          service[kpi.key] = '?';
        }
        service[kpi.key] = this.format(service[kpi.key], kpi.format);
      }, this);
    }, this);
  },

  getContent: function () {
    this.formatKpis(this.showcaseServices);
    return this.loadTemplate(templatePath, _.extend({
      services: this.collection,
      serviceCount: this.collection.length,
      webTrafficCount: this.contentDashboards.length,
      showcaseServices: this.showcaseServices
    }, this.model.toJSON()));

  }

});
