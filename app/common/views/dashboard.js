define([
  'common/views/govuk',
  'stache!common/templates/dashboard'
],
function (GovUkView, contentTemplate) {
  var DashboardView = GovUkView.extend({
    contentTemplate: contentTemplate,

    initialize: function () {

      GovUkView.prototype.initialize.apply(this, arguments);

      this.dashboardType = this.model.get('dashboardType');
    },

    getContent: function () {
      var context = this.model.toJSON();

      context.modules = _.map(this.moduleInstances, function (module) {
        return module.html;
      }).join('');

      context.header = this.getPageHeader();
      context.dashboardType = this.dashboardType;
      context.tagline = this.getTagline();

      return this.contentTemplate(context);
    },

    getTagline: function () {
      var tagline;
      if (this.dashboardType === 'other') {
        tagline = this.model.get('other').tagline;
      } else {
        tagline = 'This dashboard shows information about how ';
        if (this.dashboardType === 'transaction') {
          tagline += 'the <strong>' + this.model.get('service').title + ': ';
          tagline += this.model.get('transaction').title + '</strong> service is';
        } else if (this.dashboardType === 'service') {
          tagline += 'the <strong>' + this.model.get('service').title;
          tagline += '</strong> service is';
        } else if ((this.dashboardType === 'agency') || (this.dashboardType === 'department')) {
          tagline += 'selected services run by the <strong>';
          tagline += this.model.get(this.dashboardType).title;
          tagline += '</strong> are';
        }
        tagline += ' currently performing.';
      }
      return tagline;
    },

    getPageHeader: function () {
      var header;
      if (this.dashboardType === 'transaction') {
        header = this.model.get('service').title + ': ';
        header += this.model.get('transaction').title;
      } else {
        header = this.model.get(this.dashboardType).title;
      }
      return header;
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
      } else if (this.dashboardType === 'service') {
        crumbs.push({
          'title': this.model.get('department').title
        });
        if (this.model.get('agency')) {
          crumbs.push({
            'title': this.model.get('agency').title
          });
        }
      } else if (this.dashboardType === 'transaction') {
        crumbs.push({
          'title': this.model.get('department').title
        });
        if (this.model.get('agency')) {
          crumbs.push({
            'title': this.model.get('agency').title
          });
        }
        crumbs.push({
          'title': this.model.get('service').title
        });
      }
      return crumbs;
    }
  });

  return DashboardView;
});
