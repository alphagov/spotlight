define([
  'common/views/dashboard'
],
function (DashboardView) {
  return DashboardView.extend({

    getTagline: function () {
      return 'This dashboard shows information about how ' +
              'selected services run by the <strong>' +
              this.model.get('title') +
              '</strong> are currently performing.';
    },

    getBreadcrumbCrumbs: function () {
      var crumbs = DashboardView.prototype.getBreadcrumbCrumbs.apply(this, arguments);
      crumbs.push({
        'title': this.model.get('department').title
      });
      return crumbs;
    }

  });
});
