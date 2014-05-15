define([
  'common/views/dashboard'
],
function (DashboardView) {
  return DashboardView.extend({

    getBreadcrumbCrumbs: function () {
      var crumbs = DashboardView.prototype.getBreadcrumbCrumbs.apply(this, arguments);

      if (this.model.get('title') !== 'Activity on GOV.UK') {
        crumbs.push({ title: 'Activity on GOV.UK' });
      }

      crumbs.push({ title: this.model.get('title') });

      return crumbs;
    }

  });
});
