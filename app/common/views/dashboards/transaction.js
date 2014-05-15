define([
  'common/views/dashboard'
],
function (DashboardView) {
  return DashboardView.extend({

    getContext: function () {
      return _.extend(DashboardView.prototype.getContext.apply(this, arguments), {
        hasFooter: true
      });
    },

    getTagline: function () {
      return 'This dashboard shows information about how ' +
              'the <strong>' + this.model.get('title') +
              '</strong> service is currently performing.';
    },

    getBreadcrumbCrumbs: function () {
      var crumbs = DashboardView.prototype.getBreadcrumbCrumbs.apply(this, arguments);
      crumbs.push({
        'title': this.model.get('department').title
      });
      if (this.model.get('agency')) {
        crumbs.push({
          'title': this.model.get('agency').title
        });
      }
      return crumbs;
    }

  });
});
