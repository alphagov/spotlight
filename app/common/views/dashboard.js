define([
  'extensions/views/govuk',
  'common/views/header',
  'stache!common/templates/dashboard'
],
function (GovUkView, HeaderView, template) {
  var DashboardView = GovUkView.extend({
    template: template,

    views: {
      header: HeaderView
    }
  });

  return DashboardView;
});
