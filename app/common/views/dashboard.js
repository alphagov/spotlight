define([
  'common/views/govuk',
  'stache!common/templates/dashboard'
],
function (GovUkView, contentTemplate) {
  var DashboardView = GovUkView.extend({
    contentTemplate: contentTemplate,

    initialize: function () {

      GovUkView.prototype.initialize.apply(this, arguments);

      this.dashboardType = this.model.get('dashboard-type');
    },

    getContent: function () {
      var context = this.getContext();
      return this.contentTemplate(context);
    },

    getContext: function () {
      var context = this.model.toJSON();

      context.modules = _.map(this.moduleInstances, function (module) {
        return module.html;
      }).join('\n');

      context.header = this.getPageHeader();
      context.dashboardType = this.dashboardType;
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

  return DashboardView;
});
