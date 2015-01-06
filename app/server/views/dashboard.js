var path = require('path');

var View = require('./govuk');
var template = path.resolve(__dirname, '../templates/dashboard.html');
var pptTemplate = path.resolve(__dirname, '../templates/module-page.html');

module.exports = View.extend({
  contentTemplate: template,

  initialize: function () {

    View.prototype.initialize.apply(this, arguments);

    if (this.model.get('page-type') === 'module') {
      this.contentTemplate = pptTemplate;
    }

    this.dashboardType = this.model.get('dashboard-type');

    this.model.set('hasBigScreenView', this.hasBigScreenFlag());
  },

  hasBigScreenFlag: function() {
    var supportedDashboardType, hasSupportedModules;

    supportedDashboardType = _.contains(['transaction', 'other', 'high-volume-transaction'],
      this.model.get('dashboard-type')
    );

    hasSupportedModules = _.any(this.model.get('modules'), function(module) {
      var moduleType = module['module-type'];
      return moduleType === 'kpi' ||
             moduleType === 'realtime' ||
             moduleType === 'single_timeseries' ||
             (moduleType === 'user_satisfaction_graph' &&
              module['data-source']['data-type'] === 'user-satisfaction-score');
    });

    return supportedDashboardType && hasSupportedModules;
  },

  getContent: function () {
    var context = this.getContext();
    return this.loadTemplate(this.contentTemplate, context, 'mustache');
  },

  getContext: function () {
    var context = this.model.toJSON();

    context.modules = _.map(this.moduleInstances, function (module) {
      return module.html;
    }).join('\n');

    context.header = this.getPageHeader();
    context.dashboardType = this.dashboardType;
    context.schemaOrgItemType = this.getSchemaOrgItemType();
    context.tagline = this.getTagline();
    context.hasFooter = false;

    return context;
  },

  getTagline: function () {
    return this.model.get('tagline');
  },

  getPageHeader: function () {
    return this.model.get('title');
  },

  getSchemaOrgItemType: function () {
    return 'http://schema.org/GovernmentService';
  },

  getPageTitleItems: function () {
    var items = [];
    var strapline = this.model.get('strapline');
    if (strapline) {
      items.push(strapline);
    }
    items.push(this.getPageHeader());
    return items;
  },

  getBreadcrumbCrumbs: function () {
    var crumbs = [
      {'path': '/performance', 'title': 'Performance'}
    ];
    return crumbs;
  }

});
