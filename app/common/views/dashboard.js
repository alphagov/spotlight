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
      var context = this.model.toJSON();

      context.modules = _.map(this.moduleInstances, function (module) {
        return module.html;
      }).join('');

      context.header = this.getPageHeader();
      context.dashboardType = this.dashboardType;
      context.tagline = this.getTagline();

      context.hasFooter = (this.dashboardType === 'transaction');

      return this.contentTemplate(context);
    },

    getTagline: function () {
      var tagline = '';
      if (this.dashboardType === 'transaction') {
        tagline = 'This dashboard shows information about how ' +
                  'the <strong>' + this.model.get('title') +
                  '</strong> service is currently performing.';
      } else if ((this.dashboardType === 'agency') || (this.dashboardType === 'department')) {
        tagline = 'This dashboard shows information about how ' +
                  'selected services run by the <strong>' +
                  this.model.get('title') +
                  '</strong> are currently performing.';
      } else if (this.dashboardType === 'other') {
        tagline = this.model.get('other').tagline;
      } else if (this.model.get('tagline')) {
        tagline = this.model.get('tagline');
      }
      return tagline;
    },

    getPageHeader: function () {
      return this.model.get('title');
    },

    getPageTitleItems: function () {
      var items = [];
      items.push(this.getPageHeader());
      var strapline = this.model.get('strapline');
      if (strapline) {
        items.push(strapline);
      }
      return items;
    },

    getBreadcrumbCrumbs: function () {
      var crumbs = [
        {'path': '/performance', 'title': 'Performance'}
      ];
      if (this.dashboardType === 'agency') {
        crumbs.push({
          'title': this.model.get('department').title
        });
      } else if (this.dashboardType === 'transaction') {
        crumbs.push({
          'title': this.model.get('department').title
        });
        if (this.model.get('agency')) {
          crumbs.push({
            'title': this.model.get('agency').title
          });
        }
      }
      return crumbs;
    }
  });

  return DashboardView;
});
